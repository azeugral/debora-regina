"""Recorta as fotos escolhidas do Instagram (_ref/ig) em 4:5 e salva WebP em assets/p (640 e 1280 px de largura).
FOTOS: chave -> (post, foto do carrossel, foco vertical 0..1). As legendas e grupos ficam no index.html.

Uso: python -I tools/processar.py
"""
from pathlib import Path
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
IG = RAIZ.parent / "_ref" / "ig"
SAI = RAIZ / "assets" / "p"

FOTOS = {
    # tattoo
    "rosas": (8, 1, .45), "coruja": (24, 1, .4), "leao-flor": (63, 1, .5), "flores-borboleta": (56, 1, .45),
    "costas-flores": (103, 1, .4), "costas-delicada": (72, 1, .45), "borboleta": (38, 1, .5), "family": (13, 1, .5),
    "fenix": (112, 1, .5), "fineline-braco": (32, 1, .45), "mandala": (20, 1, .5), "pontilhismo": (132, 1, .5),
    "mandala-geometrica": (93, 1, .45), "buda": (98, 1, .4), "leao-caes": (104, 1, .4), "born-to-win": (125, 1, .5),
    "costas-lettering": (40, 2, .4), "dias-de-luta": (113, 1, .5), "veni-vidi-vici": (64, 1, .5), "coracao": (23, 1, .5),
    "stitch": (106, 1, .5), "balao": (7, 1, .45),
    # piercing
    "orelha-trio": (3, 1, .4), "orelha-mix": (12, 1, .45), "orelha-dourado": (25, 1, .5), "orelha-ponto-luz": (27, 1, .45),
    "nariz": (14, 1, .45), "nostril": (30, 1, .45), "microdermal-rosto": (10, 1, .4), "microdermal-face": (39, 1, .45),
    "microdermal-peito": (43, 1, .5), "umbigo": (28, 1, .5), "orelha-loira": (52, 1, .45),
    # retrato dela (foto enviada pelo usuário, _ref/debora-retrato.jpg; foco horizontal no rosto)
    "debora": ("debora-retrato.jpg", 0, .5),
}


def achar(n, k):
    if isinstance(n, str):
        return IG.parent / n
    for f in IG.glob(f"{n:03d}_*_{k}.jpg"):
        return f
    raise SystemExit(f"post {n} foto {k} não encontrado")


def main():
    SAI.mkdir(parents=True, exist_ok=True)
    for chave, (n, k, fy) in FOTOS.items():
        im = ImageOps.exif_transpose(Image.open(achar(n, k))).convert("RGB")
        w, h = im.size
        if w / h > .8:
            nw = int(h * .8); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
        else:
            nh = int(w / .8); y = int((h - nh) * fy); im = im.crop((0, y, w, y + nh))
        for larg in (640, 1280):
            if larg > im.width and larg == 1280:
                larg = im.width
            r = im.resize((larg, int(larg / .8)), Image.LANCZOS)
            r.save(SAI / f"{chave}-{640 if larg == 640 else 'g'}.webp", quality=80, method=6)
    print(len(FOTOS), "fotos")


if __name__ == "__main__":
    main()
