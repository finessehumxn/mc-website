# One-off: resize chosen media-kit JPEGs into web thumbnails.
from PIL import Image
import os

# source kit-N.jpg -> output name, max long-edge px
jobs = [
    ("kit-0.jpg",  "art-retro.jpg",        1100),  # orange goddess portrait
    ("kit-1.jpg",  "art-gold.jpg",         1100),  # gold-halo portrait
    ("kit-2.jpg",  "work-wendy-s.jpg",     1000),  # teal portrait (Wendy S palette)
    ("kit-18.jpg", "work-bella-high.jpg",  1000),  # rhinestone product
    ("kit-7.jpg",  "work-we-are-finesse.jpg", 1000),
    ("kit-10.jpg", "work-lestalk-radio.jpg",  1200),  # calendar mockup
    ("kit-21.jpg", "work-fruitful-remedies.jpg", 1200),  # cherry wine jars
    ("kit-23.jpg", "work-first-choice.jpg", 1200),  # pain cream trio
    ("kit-20.jpg", "brand-graffiti.jpg",    1400),  # MC graffiti logo
]

for src, out, maxedge in jobs:
    if not os.path.exists(src):
        print("MISSING", src); continue
    im = Image.open(src).convert("RGB")
    w, h = im.size
    scale = min(1.0, maxedge / max(w, h))
    if scale < 1.0:
        im = im.resize((int(w*scale), int(h*scale)), Image.LANCZOS)
    im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{out:32} {im.size}  {os.path.getsize(out)//1024}KB")
print("done")
