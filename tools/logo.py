"""Vetoriza o monograma DR (coroa + DR + arabesco) do post oficial dela (_ref/ig/045, cartão "Débora Regina INK").
O original tem só ~170 px; a máscara sai do dourado (canal vermelho alto e quente), ampliada 8x e passada no potrace.
Gera assets/img/dr.svg (fill=currentColor) e os favicons.

Uso: python -I tools/logo.py
"""
from pathlib import Path
import numpy as np, potrace
from PIL import Image, ImageFilter, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ.parent / "_ref" / "ig" / "045_DZDmqKkDTTj_1.jpg"
CAIXA = (1050, 25, 1225, 192)
ESC = 8


def mascara():
    im = np.asarray(Image.open(FONTE).convert("RGB").crop(CAIXA)).astype(np.float32)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    ouro = np.clip((r - 70) / 80, 0, 1) * (r > b + 25)
    m = Image.fromarray((ouro * 255).astype(np.uint8))
    m = m.resize((m.width * ESC, m.height * ESC), Image.LANCZOS).filter(ImageFilter.GaussianBlur(ESC * .45))
    a = np.array(m) > 120
    # fica só o DR: descarta respingos do fundo, a coroa e o arabesco (finos demais no original)
    import cv2
    n, lab, st, _ = cv2.connectedComponentsWithStats(a.astype(np.uint8), 8)
    grandes = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 20000]
    return np.isin(lab, grandes)


def svg(a, dst):
    path = potrace.Bitmap(~a).trace(turdsize=60, alphamax=1.0, opticurve=True, opttolerance=0.3)
    ys, xs = np.where(a); pad = ESC * 2
    x0, y0, x1, y1 = xs.min() - pad, ys.min() - pad, xs.max() + pad, ys.max() + pad
    parts = []
    for c in path:
        s = c.start_point; d = [f"M{s.x:.0f} {s.y:.0f}"]
        for seg in c.segments:
            if seg.is_corner: d.append(f"L{seg.c.x:.0f} {seg.c.y:.0f}L{seg.end_point.x:.0f} {seg.end_point.y:.0f}")
            else: d.append(f"C{seg.c1.x:.0f} {seg.c1.y:.0f} {seg.c2.x:.0f} {seg.c2.y:.0f} {seg.end_point.x:.0f} {seg.end_point.y:.0f}")
        parts.append("".join(d) + "Z")
    dst.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1-x0} {y1-y0}"><path fill="currentColor" fill-rule="evenodd" d="{"".join(parts)}"/></svg>', encoding="utf-8")
    print(dst.name, len(parts), "contornos", x1 - x0, "x", y1 - y0)
    return (x0, y0, x1, y1)


def main():
    a = mascara()
    Image.fromarray((a * 255).astype(np.uint8)).save(RAIZ.parent / "_ref" / "dr-mascara.png")
    svg(a, RAIZ / "assets" / "img" / "dr.svg")
    # favicons: o DR dourado sobre preto, a partir da própria máscara
    ys, xs = np.where(a); bb = (xs.min(), ys.min(), xs.max(), ys.max())
    m = Image.fromarray((a * 255).astype(np.uint8)).crop(bb)
    for nome, lado in [("favicon-32.png", 32), ("favicon-192.png", 192), ("apple-touch-icon.png", 180)]:
        base = Image.new("RGB", (lado, lado), (12, 10, 9))
        mm = m.copy(); mm.thumbnail((int(lado * .62), int(lado * .8)), Image.LANCZOS)
        ouro = Image.new("RGB", mm.size, (205, 160, 110))
        base.paste(ouro, ((lado - mm.width) // 2, (lado - mm.height) // 2), mm)
        base.save(RAIZ / nome)
    Image.open(RAIZ / "favicon-32.png").save(RAIZ / "favicon.ico", sizes=[(32, 32), (16, 16)])




def injetar():
    """Coloca o DR como <symbol id="dr"> no index.html e acerta o viewBox dos <svg> que o usam."""
    import re
    s = (RAIZ / "assets" / "img" / "dr.svg").read_text(encoding="utf-8")
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    d = re.search(r' d="([^"]+)"', s).group(1)
    w, h = vb.split()[2:]
    p = RAIZ / "index.html"
    html = p.read_text(encoding="utf-8")
    html = re.sub(r'<defs>.*?</defs>', f'<defs><symbol id="dr" viewBox="{vb}"><path fill="currentColor" fill-rule="evenodd" d="{d}"/></symbol></defs>', html, flags=re.S)
    html = html.replace('<defs><!--DR--></defs>', '')
    p.write_text(html, encoding="utf-8")
    print("DR injetado", vb)


if __name__ == "__main__":
    main()
    injetar()
