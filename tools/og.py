"""Prévia de link (og.jpg 1200x630): DR dourado + nome sobre o breu, com três fotos à direita.
Uso: python -I tools/og.py"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
RAIZ = Path(__file__).resolve().parent.parent
im = Image.new("RGB", (1200, 630), (12, 10, 9))
m = Image.open(RAIZ.parent / "_ref" / "dr-mascara.png").convert("L")
m = m.crop(m.getbbox()); m.thumbnail((150, 170), Image.LANCZOS)
im.paste(Image.new("RGB", m.size, (207, 162, 113)), (90, 120), m)
d = ImageDraw.Draw(im)
def fonte(n, t):
    for f in [n, "georgia.ttf", "arial.ttf"]:
        try: return ImageFont.truetype(f, t)
        except OSError: pass
d.text((90, 330), "DÉBORA REGINA", font=fonte("georgia.ttf", 52), fill=(239, 231, 220))
d.text((92, 400), "I N K", font=fonte("georgia.ttf", 22), fill=(231, 200, 156))
d.text((90, 470), "Tatuagem e piercing · Agualva-Cacém", font=fonte("arial.ttf", 24), fill=(168, 157, 144))
for i, k in enumerate(["coruja", "orelha-mix", "rosas"]):
    f = Image.open(RAIZ / "assets" / "p" / f"{k}-640.webp").convert("RGB").resize((200, 250))
    im.paste(f, (600 + i * 196, 70 + (i % 2) * 120))
im.save(RAIZ / "og.jpg", quality=86)
print("og.jpg")
