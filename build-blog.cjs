// Builds the blog: reads blog-data/*.json (one post each) and generates
// blog.html (index) + blog-<slug>.html (article pages) using the shared site shell.
// Run: node build-blog.cjs   (after build-pages.cjs so nav/footer are current)
const fs = require("fs");
const path = require("path");
const { head, nav, footerScript } = require("./build-pages.cjs");

const DATA_DIR = "blog-data";

const GRADS = {
  pink:   "linear-gradient(135deg,#1a0f40,#ff2d78)",
  green:  "linear-gradient(135deg,#0a2a0a,#00ff88)",
  yellow: "linear-gradient(135deg,#1a1a3e,#ffd84d)",
  purple: "linear-gradient(135deg,#2d1b69,#7b2ff7)",
  orange: "linear-gradient(135deg,#40121f,#ff6b35)",
  blue:   "linear-gradient(135deg,#06283d,#1fb6ff)",
};
const ACCENTS = Object.keys(GRADS);

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const initials = (name) => name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

// load posts
const posts = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json")).map(f => {
  const p = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
  p.accent = p.accent && GRADS[p.accent] ? p.accent : ACCENTS[Math.abs([...p.slug].reduce((a, c) => a + c.charCodeAt(0), 0)) % ACCENTS.length];
  return p;
}).sort((a, b) => b.date.localeCompare(a.date)); // newest first

if (!posts.length) { console.log("No posts in", DATA_DIR); process.exit(0); }

// ---- article pages ----
function articlePage(p, prev, next) {
  const grad = GRADS[p.accent];
  const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  const more = [prev, next].filter(Boolean).map(o =>
    `<a class="more-card" href="blog-${o.slug}.html"><div class="mc-img" style="background:${GRADS[o.accent]}"><span>${initials(o.name)}</span></div><div><div class="mc-cat">${esc(o.industry)}</div><div class="mc-t">${esc(o.title)}</div></div></a>`
  ).join("");
  const body = head(p.title + " — MC Blog", p.dek) + nav("blog.html") +
    `<main class="article">
  <a class="art-back" href="blog.html">← All stories</a>
  <div class="art-meta"><span class="art-cat">${esc(p.industry)}</span><span>·</span><time>${fmtDate(p.date)}</time><span>·</span><span>${esc(p.readtime || "5 min read")}</span></div>
  <h1 class="art-h1">${esc(p.title)}</h1>
  <p class="art-dek">${esc(p.dek)}</p>
  <div class="art-hero" style="background:${grad}"><span class="art-hero-name">${esc(p.name)}</span><span class="art-hero-brand">${esc(p.brand)}</span></div>
  <article class="art-body">${p.body_html}</article>
  <div class="tagrow">${tags}</div>
  <div class="art-share">Story by <b>Millennials Creatives</b> · <a href="contact.html">Work with us →</a></div>
  ${more ? `<h3 class="more-h">Keep reading</h3><div class="more-grid">${more}</div>` : ""}
</main>` + footerScript;
  fs.writeFileSync(`blog-${p.slug}.html`, body);
}

posts.forEach((p, i) => articlePage(p, posts[i + 1], posts[i - 1]));

// ---- index page ----
const cards = posts.map(p =>
  `<a class="blog-card" href="blog-${p.slug}.html">
      <div class="bc-img" style="background:${GRADS[p.accent]}"><span class="bc-mono">${initials(p.name)}</span><span class="bc-badge">${esc(p.industry)}</span></div>
      <div class="bc-body">
        <div class="bc-date">${fmtDate(p.date)} · ${esc(p.readtime || "5 min")}</div>
        <div class="bc-title">${esc(p.title)}</div>
        <div class="bc-dek">${esc(p.dek)}</div>
        <div class="bc-read">Read story</div>
      </div>
    </a>`
).join("\n      ");

const indexPage = head("Blog — Money, Creativity & Culture", "Fun, pop-culture profiles of the millennial & Gen-Z millionaires and billionaires building the most creative brands on the planet.") +
  nav("blog.html") +
  `<main class="pg">
    <div class="pg-eyebrow">The Blog</div>
    <h1 class="pg-h1">Money, creativity &amp; <em>culture.</em></h1>
    <p class="pg-lead">A weekly drop on the millennial &amp; Gen-Z millionaires and billionaires turning wild ideas into empires — the products, the websites, the brand worlds, and the come-up stories behind them. No boring business-school energy. Just the good stuff.</p>
    <div class="blog-grid">
      ${cards}
    </div>
  </main>` + footerScript;
fs.writeFileSync("blog.html", indexPage);

// ---- homepage "Latest from the Blog" injection (between markers, if present) ----
try {
  let index = fs.readFileSync("index.html", "utf8");
  if (index.includes("<!-- BLOG:START -->")) {
    const three = posts.slice(0, 3).map(p =>
      `<a class="blog-card reveal" href="blog-${p.slug}.html"><div class="bc-img" style="background:${GRADS[p.accent]}"><span class="bc-mono">${initials(p.name)}</span><span class="bc-badge">${esc(p.industry)}</span></div><div class="bc-body"><div class="bc-date">${fmtDate(p.date)} · ${esc(p.readtime || "5 min")}</div><div class="bc-title">${esc(p.title)}</div><div class="bc-dek">${esc(p.dek)}</div><div class="bc-read">Read story</div></div></a>`
    ).join("\n      ");
    index = index.replace(/<!-- BLOG:START -->[\s\S]*?<!-- BLOG:END -->/, `<!-- BLOG:START -->\n      ${three}\n    <!-- BLOG:END -->`);
    fs.writeFileSync("index.html", index);
    console.log("Injected 3 latest posts into homepage");
  }
} catch (e) { console.log("homepage inject skipped:", e.message); }

console.log("Built blog:", posts.length, "posts +", "blog.html");
