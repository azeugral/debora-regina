"""Logo oficial da Débora (_ref/logo-oficial.webp, 2000 px, dourado com fundo transparente).
Gera assets/img/logo.webp (1400 px) e logo-800.webp, a coroa recortada (coroa.webp) e os favicons com a coroa.

Uso: python -I tools/logo.py
"""
from pathlib import Path
import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ.parent / "_ref" / "logo-oficial.webp"
IMG = RAIZ / "assets" / "img"
COROA = (848, 34, 1152, 268)  # caixa da coroa no original


def main():
    IMG.mkdir(parents=True, exist_ok=True)
    logo = Image.open(FONTE).convert("RGBA")
    a = np.asarray(logo).copy()
    a[..., 3] = np.clip(a[..., 3].astype(int) * 255 // max(1, a[..., 3].max()), 0, 255)  # o alfa do original não chega a 255
    logo = Image.fromarray(a, "RGBA")
    logo = logo.crop(logo.getbbox())
    for nome, larg in [("logo.webp", 1400), ("logo-800.webp", 800)]:
        l = logo.resize((larg, round(logo.height * larg / logo.width)), Image.LANCZOS)
        l.save(IMG / nome, quality=90, method=6)
        print(nome, l.size)
    b = a.copy()
    b[225:, 1105:, 3] = 0  # o início do arabesco do R encosta no canto da coroa
    coroa = Image.fromarray(b, "RGBA").crop(COROA)
    coroa = coroa.crop(coroa.getbbox())
    coroa.resize((240, round(coroa.height * 240 / coroa.width)), Image.LANCZOS).save(IMG / "coroa.webp", quality=90, method=6)
    print("coroa", coroa.size)
    for nome, lado in [("favicon-32.png", 32), ("favicon-192.png", 192), ("apple-touch-icon.png", 180)]:
        base = Image.new("RGBA", (lado, lado), (12, 10, 9, 255))
        c = coroa.copy(); c.thumbnail((int(lado * .8), int(lado * .7)), Image.LANCZOS)
        base.alpha_composite(c, ((lado - c.width) // 2, (lado - c.height) // 2))
        base.convert("RGB").save(RAIZ / nome)
    Image.open(RAIZ / "favicon-32.png").save(RAIZ / "favicon.ico", sizes=[(32, 32), (16, 16)])


if __name__ == "__main__":
    main()
