"""Prévia de link (og.jpg 1200x630): logo oficial dourado sobre o breu, com três trabalhos à direita.
Uso: python -I tools/og.py"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
RAIZ = Path(__file__).resolve().parent.parent
im = Image.new("RGBA", (1200, 630), (12, 10, 9, 255))
logo = Image.open(RAIZ / "assets" / "img" / "logo.webp").convert("RGBA")
logo.thumbnail((560, 260), Image.LANCZOS)
im.alpha_composite(logo, (40, 170))
d = ImageDraw.Draw(im)
d.text((70, 470), "Agualva-Cacém · Sintra", font=ImageFont.truetype("arial.ttf", 24), fill=(171, 159, 143))
for i, k in enumerate(["coruja", "orelha-mix", "rosas"]):
    f = Image.open(RAIZ / "assets" / "p" / f"{k}-640.webp").convert("RGBA").resize((176, 220))
    im.alpha_composite(f, (640 + i * 180, 90 + (i % 2) * 140))
im.convert("RGB").save(RAIZ / "og.jpg", quality=86)
print("og.jpg")
