// Auto-updating "Culture & Inspiration" news feed.
// Pulls latest articles from real publication RSS feeds, generates clickable cards,
// injects 3 into the homepage and builds the full culture.html feed.
// Run daily by .github/workflows/culture-daily.yml (and locally via `node build-culture.cjs`).
const fs = require("fs");
const { head, nav, footerScript } = require("./build-pages.cjs");

// Publications that document the millennial/Gen-Z entrepreneurship + culture shift.
const FEEDS = [
  { url: "https://www.entrepreneur.com/latest.rss", source: "Entrepreneur" },
  { url: "https://www.inc.com/rss/",                source: "Inc." },
  { url: "https://www.fastcompany.com/latest/rss",  source: "Fast Company" },
  { url: "https://www.blackenterprise.com/feed/",   source: "Black Enterprise" },
  { url: "https://www.essence.com/feed/",           source: "Essence" },
  { url: "https://www.forbes.com/business/feed/",   source: "Forbes" },
  { url: "https://techcrunch.com/feed/",            source: "TechCrunch" },
  { url: "https://venturebeat.com/feed/",           source: "VentureBeat" },
  { url: "https://thestoryexchange.org/feed/",      source: "The Story Exchange" },
];

// Keep entrepreneurship/culture stories; drop puzzles, horoscopes, sports, deals, etc.
const JUNK = /(strands|wordle|connections|quordle|crossword|sudoku|horoscope|\bnyt\b|recipe|box score|\bodds\b|prediction|sportsbook|how to watch|coupon|deal of the day|answers today|hints? (&|and) clues|gift guide|best deals)/i;
const RELEVANT = /(entrepreneur|founder|startup|small business|\bbusiness\b|\bwomen?\b|female|black|minority|latina|leader|brand|market|compan(y|ies)|\bceo\b|funding|venture|invest|growth|culture|innovat|\bai\b|artificial intelligence|creator|economy|wealth|owner|workplace|career|hustle|nonprofit|equity)/i;

// Brand gradients + accent for the card art (rotated).
const LOOKS = [
  { grad: "linear-gradient(135deg,#1a0f40,#ff2d78)", color: "var(--pink)",  badge: "background:var(--pink);color:#fff" },
  { grad: "linear-gradient(135deg,#0a2a0a,#00ff88)", color: "var(--green)", badge: "background:var(--green);color:var(--dark)" },
  { grad: "linear-gradient(135deg,#1a1a3e,#ffd84d)", color: "var(--yellow)",badge: "background:var(--yellow);color:var(--dark)" },
  { grad: "linear-gradient(135deg,#2d1b69,#7b2ff7)", color: "#b98bff",      badge: "background:#7b2ff7;color:#fff" },
  { grad: "linear-gradient(135deg,#40121f,#ff6b35)", color: "#ff9e6b",      badge: "background:#ff6b35;color:#fff" },
  { grad: "linear-gradient(135deg,#06283d,#1fb6ff)", color: "#7fd6ff",      badge: "background:#1fb6ff;color:#fff" },
];

// Publication brand logos (self-hosted; fetched by fetch-news-logos.py)
const SOURCE_LOGO = {
  "Entrepreneur": "media/news-logos/entrepreneur.png",
  "Inc.": "media/news-logos/inc.png",
  "Fast Company": "media/news-logos/fastcompany.png",
  "Black Enterprise": "media/news-logos/blackenterprise.png",
  "Essence": "media/news-logos/essence.png",
  "Forbes": "media/news-logos/forbes.png",
  "TechCrunch": "media/news-logos/techcrunch.png",
  "VentureBeat": "media/news-logos/venturebeat.png",
  "The Story Exchange": "media/news-logos/thestoryexchange.png",
};

const decode = (s = "") => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&rsquo;|&#8217;/g, "'")
  .replace(/&#8216;/g, "'").replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
  .replace(/&hellip;|&#8230;/g, "…").replace(/, |&#8212;/g, ", ")
  .replace(/&nbsp;/g, " ").replace(/&[a-z]+;/gi, " ")
  .replace(/\s+/g, " ").trim();

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tag = (block, name) => { const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };
const truncate = (s, n) => s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s;
const fmtDate = (d) => { const t = new Date(d); return isNaN(t) ? "" : t.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };

async function fetchFeed(feed) {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(feed.url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (MCNewsBot; +https://mcre8.com)" } });
    clearTimeout(to);
    if (!res.ok) { console.log("  skip", feed.source, res.status); return []; }
    const xml = await res.text();
    const items = (xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || []).slice(0, 6);
    return items.map(it => {
      let link = decode(tag(it, "link"));
      if (!link) { const a = it.match(/<link[^>]*href="([^"]+)"/i); link = a ? a[1] : ""; }
      const title = decode(tag(it, "title"));
      const desc = decode(tag(it, "description") || tag(it, "summary") || tag(it, "content:encoded"));
      const date = decode(tag(it, "pubDate") || tag(it, "published") || tag(it, "updated"));
      return { source: feed.source, title, link, excerpt: desc, date, ts: new Date(date).getTime() || 0 };
    }).filter(x => x.title && x.link && /^https?:\/\//.test(x.link))
      .filter(x => !JUNK.test(x.title) && RELEVANT.test(x.title + " " + x.excerpt));
  } catch (e) { console.log("  fail", feed.source, e.message); return []; }
}

function pickDiverse(all, n) {
  // newest first, but round-robin by source so one feed can't dominate
  const bySource = {};
  all.sort((a, b) => b.ts - a.ts).forEach(x => (bySource[x.source] ||= []).push(x));
  const queues = Object.values(bySource);
  const out = [];
  let i = 0;
  while (out.length < n && queues.some(q => q.length)) {
    const q = queues[i % queues.length];
    if (q.length) out.push(q.shift());
    i++;
  }
  return out;
}

function cardHTML(item, idx, extraClass = "") {
  const look = LOOKS[idx % LOOKS.length];
  const logo = SOURCE_LOGO[item.source];
  const art = logo
    ? `<div class="cc-img" style="background:${look.grad}"><span class="cc-logo-wrap"><img class="cc-logo" src="${logo}" alt="${esc(item.source)}" loading="lazy"></span></div>`
    : `<div class="cc-img" style="background:${look.grad}"><div class="cc-img-bg" style="color:${look.color}">${esc(item.source.split(" ")[0])}</div><span class="cc-badge" style="${look.badge}">${esc(item.source)}</span></div>`;
  return `<a class="culture-card${extraClass}" href="${esc(item.link)}" target="_blank" rel="noopener">
        ${art}
        <div class="cc-body">
          <div class="cc-source">${esc(item.source)}${item.date ? " · " + esc(fmtDate(item.date)) : ""}</div>
          <div class="cc-title">${esc(truncate(item.title, 110))}</div>
          <div class="cc-excerpt">${esc(truncate(item.excerpt || "", 150))}</div>
          <div class="cc-read">Read on ${esc(item.source)}</div>
        </div>
      </a>`;
}

(async () => {
  console.log("Fetching", FEEDS.length, "feeds…");
  const results = await Promise.all(FEEDS.map(fetchFeed));
  let all = results.flat();
  // dedupe by title
  const seen = new Set();
  all = all.filter(x => { const k = x.title.toLowerCase().slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true; });
  console.log("Collected", all.length, "unique articles");

  if (all.length < 4) { console.log("Too few articles fetched, leaving existing content untouched."); process.exit(0); }

  const feed = pickDiverse(all, 9);
  const homeThree = feed.slice(0, 3);

  // 1) inject 3 newest into the homepage between markers
  let index = fs.readFileSync("index.html", "utf8");
  const homeCards = "\n      " + homeThree.map((it, i) => cardHTML(it, i, i ? " reveal reveal-d" + i : " reveal")).join("\n      ") + "\n    ";
  index = index.replace(/<!-- CULTURE:START -->[\s\S]*?<!-- CULTURE:END -->/, `<!-- CULTURE:START -->${homeCards}<!-- CULTURE:END -->`);
  fs.writeFileSync("index.html", index);
  console.log("Updated homepage culture preview (3 cards)");

  // 2) build the full culture.html feed page
  const updated = fmtDate(new Date());
  const grid = feed.map((it, i) => cardHTML(it, i)).join("\n      ");
  const values = `<div class="pg-section"><h2>What we stand for</h2>
      <div class="pg-grid">
        ${["01|Bold over boring|If it is safe and forgettable, we have not done our job yet.",
            "02|Partners, not vendors|We sit on your side of the table and own the outcome.",
            "03|Built for everyone|Representation and accessibility are defaults, not afterthoughts.",
            "04|We ship|Strategy is nothing without a thing in the world. We build and launch.",
            "05|Outcomes first|Pretty is the baseline. We are here to move the numbers.",
            "06|Human|Real people, real care, in the work and with each other."]
          .map(v => { const [ic,h,p] = v.split("|"); return `<div class="pg-card"><span class="ic">${ic}</span><h3>${h}</h3><p>${p}</p></div>`; }).join("\n        ")}
      </div>
    </div>`;

  const body = `<div class="updated">Updated daily · last refreshed ${updated}</div>
    <div class="culture-grid">
      ${grid}
    </div>
    ${values}`;

  const page = head("Culture & Inspiration", "The latest on millennial & Gen-Z entrepreneurs, women-owned business, and the culture shift Millennials Creatives operates in.") +
    nav("culture.html") +
    `<main class="pg"><div class="pg-eyebrow">Culture &amp; Inspiration</div><h1 class="pg-h1">The founders <em>crushing the game.</em></h1><p class="pg-lead">Millennial &amp; Gen-Z entrepreneurs, women-owned business, and the publications documenting the shift, refreshed every day. This is the world we operate in, and the company we keep.</p>${body}</main>` +
    footerScript;
  fs.writeFileSync("culture.html", page);
  console.log("Built culture.html feed (" + feed.length + " articles)");
  console.log("done");
})();
