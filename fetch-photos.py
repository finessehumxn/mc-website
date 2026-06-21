# Fetches freely-licensed founder portraits from Wikipedia/Wikimedia Commons.
# Saves media/blog/<slug>.jpg (resized) + media/blog/credits.json (attribution).
# Only Commons/Wikipedia infobox images for living people (almost always freely licensed).
# Run: python fetch-photos.py
import json, os, re, glob, urllib.request, urllib.parse, io
from PIL import Image

UA = "MCBlogBot/1.0 (https://mcre8.com; contact@millennialscreatives.com)"
OUT = "media/blog"
os.makedirs(OUT, exist_ok=True)

# Wikipedia page titles where they differ from the display name.
TITLE_OVERRIDE = {
    "mrbeast-feastables": "MrBeast",
    "bobby-hundreds": "Bobby Hundreds",
    "tobi-lutke-shopify": "Tobias Lütke",
    "jasmine-crowe-goodr": "Jasmine Crowe",
    "bobby-murphy-snap": "Bobby Murphy (entrepreneur)",
    "marques-brownlee-mkbhd": "Marques Brownlee",
    "tyler-the-creator-golf-wang": "Tyler, the Creator",
    "serena-williams-ventures": "Serena Williams",
    "naomi-osaka-kinlo": "Naomi Osaka",
    "selena-gomez-rare": "Selena Gomez",
    "jaden-smith-just": "Jaden Smith",
    "issa-rae-hoorae": "Issa Rae",
    "emma-chamberlain-coffee": "Emma Chamberlain",
    "whitney-wolfe-herd-bumble": "Whitney Wolfe Herd",
    "ben-francis-gymshark": "Ben Francis (businessman)",
    "melanie-perkins-canva": "Melanie Perkins",
    "alexandr-wang-scale": "Alexandr Wang",
    "vlad-tenev-robinhood": "Vlad Tenev",
    "apoorva-mehta-instacart": "Apoorva Mehta",
    "payal-kadakia-classpass": "Payal Kadakia",
    "tristan-walker-bevel": "Tristan Walker",
    "huda-kattan": "Huda Kattan",
    "rihanna-fenty": "Rihanna",
    "marsai-martin": "Marsai Martin",
    "patrick-starrr-onesize": "Patrick Starrr",
    "addison-rae-item-beauty": "Addison Rae",
    "charli-damelio": "Charli D'Amelio",
    "daniel-ek-spotify": "Daniel Ek",
    "palmer-luckey-anduril": "Palmer Luckey",
    "austin-russell-luminar": "Austin Russell (entrepreneur)",
    "tope-awotona-calendly": "Tope Awotona",
    "reshma-saujani": "Reshma Saujani",
    "robert-reffkin-compass": "Robert Reffkin",
    "winnie-harlow-cay-skin": "Winnie Harlow",
    "anjali-sud-vimeo": "Anjali Sud",
    "katrina-lake-stitch-fix": "Katrina Lake",
    "sophia-amoruso": "Sophia Amoruso",
    "hyram-yarbro-selfless": "Hyram Yarbro",
    "rich-paul-klutch": "Rich Paul",
    "divya-gokulnath-byjus": "Divya Gokulnath",
    "christina-tosi-milk-bar": "Christina Tosi",
    "emily-weiss-glossier": "Emily Weiss",
    "morgan-debaun-blavity": "Morgan DeBaun",
    "telfar-clemens": "Telfar Clemens",
    "emma-grede": "Emma Grede",
    "jen-rubio-away": "Jen Rubio",
    "aurora-james": "Aurora James",
    "mikaila-ulmer-bees": "Mikaila Ulmer",
    "nadya-okamoto-august": "Nadya Okamoto",
}

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()

def commons_credit(img_url):
    # derive File: name and query license/artist
    try:
        fname = urllib.parse.unquote(img_url.split("/")[-1])
        # if it's a thumb path, the real file name is the last segment before any /thumb resize — handle common case
        api = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
            "action": "query", "titles": "File:" + fname, "prop": "imageinfo",
            "iiprop": "extmetadata", "format": "json"})
        data = get_json(api)
        pages = data.get("query", {}).get("pages", {})
        for _, p in pages.items():
            ii = p.get("imageinfo")
            if not ii: continue
            ext = ii[0].get("extmetadata", {})
            lic = strip_html(ext.get("LicenseShortName", {}).get("value", "")) or "Wikimedia Commons"
            artist = strip_html(ext.get("Artist", {}).get("value", "")) or "Wikimedia Commons"
            return {"artist": artist[:120], "license": lic[:60]}
    except Exception as e:
        print("   credit lookup failed:", e)
    return {"artist": "Wikimedia Commons", "license": "Wikimedia Commons"}

def save_image(img_url, slug):
    req = urllib.request.Request(img_url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    target_w = 700
    if w > target_w:
        im = im.resize((target_w, int(h * target_w / w)), Image.LANCZOS)
    im.save(os.path.join(OUT, slug + ".jpg"), "JPEG", quality=82, optimize=True, progressive=True)
    return im.size

credits = {}
if os.path.exists(os.path.join(OUT, "credits.json")):
    credits = json.load(open(os.path.join(OUT, "credits.json"), encoding="utf-8"))

slugs = sorted(os.path.basename(f)[:-5] for f in glob.glob("blog-data/*.json"))
got = skipped = 0
for slug in slugs:
    if os.path.exists(os.path.join(OUT, slug + ".jpg")) and slug in credits:
        got += 1; continue
    data = json.load(open(f"blog-data/{slug}.json", encoding="utf-8"))
    title = TITLE_OVERRIDE.get(slug, data["name"])
    try:
        url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(title.replace(" ", "_"))
        s = get_json(url)
        if s.get("type") == "disambiguation":
            print("  ? disambig:", slug, title); skipped += 1; continue
        img = (s.get("originalimage") or s.get("thumbnail") or {}).get("source")
        if not img:
            print("  - no image:", slug, title); skipped += 1; continue
        size = save_image(img, slug)
        cr = commons_credit(img)
        cr["source"] = s.get("content_urls", {}).get("desktop", {}).get("page", "")
        credits[slug] = cr
        print(f"  + {slug:34} {size}  [{cr['license']}]")
        got += 1
    except Exception as e:
        print("  x fail:", slug, title, "->", e); skipped += 1

json.dump(credits, open(os.path.join(OUT, "credits.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"\nphotos: {got} have images, {skipped} skipped (gradient fallback). credits.json updated.")
