# Fetch real publication brand icons (apple-touch-icon / icon) for the news feed cards.
# Saves media/news-logos/<name>.png (square, ~128px). Run: python fetch-news-logos.py
import os, re, io, urllib.request, urllib.parse
from PIL import Image

UA = "Mozilla/5.0 (MCNewsLogoBot; +https://mcre8.com)"
OUT = "media/news-logos"
os.makedirs(OUT, exist_ok=True)

SOURCES = {
    "entrepreneur": "entrepreneur.com",
    "inc": "inc.com",
    "fastcompany": "fastcompany.com",
    "blackenterprise": "blackenterprise.com",
    "essence": "essence.com",
    "forbes": "forbes.com",
    "techcrunch": "techcrunch.com",
    "venturebeat": "venturebeat.com",
    "thestoryexchange": "thestoryexchange.org",
}

def get(url, binary=False, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read() if binary else r.read().decode("utf-8", "ignore")

def find_icons(html, base):
    icons = []
    for m in re.finditer(r'<link[^>]+>', html, re.I):
        tag = m.group(0)
        if not re.search(r'rel=["\'][^"\']*icon', tag, re.I):
            continue
        href = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
        if not href:
            continue
        sizes = re.search(r'sizes=["\']?(\d+)', tag, re.I)
        apple = "apple-touch-icon" in tag.lower()
        px = int(sizes.group(1)) if sizes else (180 if apple else 32)
        icons.append((px, urllib.parse.urljoin(base, href.group(1))))
    # og:image as a last resort (often a logo/banner)
    og = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', html, re.I)
    if og:
        icons.append((90, urllib.parse.urljoin(base, og.group(1))))
    icons.sort(key=lambda t: -t[0])  # biggest first
    return icons

def save_square(raw, name):
    im = Image.open(io.BytesIO(raw)).convert("RGBA")
    w, h = im.size
    if min(w, h) < 24:
        return None
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    if side > 160:
        canvas = canvas.resize((160, 160), Image.LANCZOS)
    canvas.save(os.path.join(OUT, name + ".png"), "PNG", optimize=True)
    return canvas.size

ok = bad = 0
for name, dom in SOURCES.items():
    saved = None
    for base in (f"https://www.{dom}/", f"https://{dom}/"):
        try:
            html = get(base)
            for px, url in find_icons(html, base):
                try:
                    raw = get(url, binary=True)
                    saved = save_square(raw, name)
                    if saved:
                        print(f"  + {name:18} {saved}  <- {url[:70]}")
                        break
                except Exception:
                    continue
            if saved:
                break
        except Exception as e:
            continue
    if saved:
        ok += 1
    else:
        bad += 1
        print(f"  x {name:18} no usable icon")
print(f"\nlogos: {ok} ok, {bad} failed")
