// Generates the 7 missing Millennials Creatives pages with shared header/footer/brand.
// Run: node build-pages.cjs
const fs = require("fs");

const head = (title, desc) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Millennials Creatives LLC</title>
<meta name="description" content="${desc}">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Permanent+Marker&family=Unbounded:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="cur" id="cur"></div><div class="cur-ring" id="curRing"></div>`;

const nav = (active) => {
  const link = (href, label) => `<li><a href="${href}"${active===href?' style="color:var(--yellow)"':''}>${label}</a></li>`;
  const mlink = (href, label) => `<a href="${href}" onclick="cm()">${label}</a>`;
  return `
<nav id="nav">
  <a class="nav-logo" href="index.html" style="text-decoration:none">
    <img src="mc-logo.jpeg" alt="Millennials Creatives Logo">
    <span class="nav-logo-text">MC</span>
  </a>
  <ul class="nav-links">
    ${link("work.html","Work")}${link("services.html","Services")}${link("team.html","Team")}
    ${link("government.html","Gov Contracts")}${link("packages.html","Packages")}${link("culture.html","Culture")}
    <li><a href="contact.html" class="nav-cta">Start a Project</a></li>
  </ul>
  <button class="nav-ham" id="ham"><span></span><span></span><span></span></button>
</nav>
<div class="mob" id="mob">
  <button class="mob-x" id="mobX">CLOSE ✕</button>
  ${mlink("work.html","Work")}${mlink("services.html","Services")}${mlink("team.html","Team")}
  ${mlink("government.html","Gov Contracts")}${mlink("packages.html","Packages")}${mlink("culture.html","Culture")}
  ${mlink("contact.html","Start a Project")}
</div>`;
};

const footerScript = `
<div class="cta-band">
  <div class="cta-h">READY TO<br>GO FROM BORING<br>TO ICONIC?</div>
  <div class="cta-actions">
    <a href="contact.html" class="btn-primary" style="background:var(--dark);color:var(--yellow);border:2px solid var(--dark)">Start Your Project →</a>
    <a href="packages.html" class="btn-ghost" style="border-color:var(--dark);color:var(--dark)">View Packages</a>
  </div>
</div>
<footer>
  <div class="footer-in">
    <div class="f-logo"><img src="mc-logo.jpeg" alt="MC Logo"></div>
    <div class="f-links">
      <a href="work.html">Work</a><a href="services.html">Services</a>
      <a href="team.html">Team</a><a href="government.html">Government</a>
      <a href="packages.html">Packages</a><a href="culture.html">Culture</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="f-meta">© 2026 Millennials Creatives LLC<br>Phoenix AZ · Woman-Owned<br>CAGE 18ZQ0 · SAM Registered</div>
  </div>
</footer>
<script>
document.getElementById('ham').onclick=()=>document.getElementById('mob').classList.add('open');
document.getElementById('mobX').onclick=()=>document.getElementById('mob').classList.remove('open');
function cm(){document.getElementById('mob').classList.remove('open')}
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>{if(window.scrollY>60)navEl.classList.add('stuck');else navEl.classList.remove('stuck')});
const cur=document.getElementById('cur'),ring=document.getElementById('curRing');
if(cur){document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';setTimeout(()=>{ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';},80);});
document.querySelectorAll('a,button,.pg-card,.capbox').forEach(el=>{el.addEventListener('mouseenter',()=>{cur.style.width='24px';cur.style.height='24px';ring.style.width='64px';ring.style.height='64px'});el.addEventListener('mouseleave',()=>{cur.style.width='16px';cur.style.height='16px';ring.style.width='44px';ring.style.height='44px'});});}
</script>
</body></html>`;

const card = (ic, h, p, extra="") => `<div class="pg-card"><span class="ic">${ic}</span><h3>${h}</h3><p>${p}</p>${extra}</div>`;
const ul = (items) => `<ul>${items.map(i=>`<li>${i}</li>`).join("")}</ul>`;

const pageShell = (file, active, title, desc, eyebrow, h1, lead, body) =>
  head(title, desc) + nav(active) +
  `<main class="pg"><div class="pg-eyebrow">${eyebrow}</div><h1 class="pg-h1">${h1}</h1><p class="pg-lead">${lead}</p>${body}</main>` +
  footerScript;

const pages = {
  "services.html": pageShell("services.html","services.html","Services","Brand strategy, AI systems, healthcare consulting, and government contracting.",
    "What we do","We do the <em>whole</em> transformation.","Four credentialed co-founders covering brand, technology, healthcare, and government — so you do not need five different agencies.",
    `<div class="pg-grid">
      ${card("🎯","Brand Strategy & Identity","Positioning, naming, identity systems, and the story that makes you impossible to ignore.")}
      ${card("🤖","AI Systems & Engineering","Custom AI products, automation, and full-stack builds — from prototype to launched app.")}
      ${card("🩺","Healthcare Consulting","Health-tech strategy, clinical-aware product design, and compliance-minded builds.")}
      ${card("🏛️","Government Contracting","Capability statements, SAM.gov-ready proposals, and delivery for public-sector work.")}
      ${card("🌐","Web & Digital","High-converting sites, web apps, and PWAs engineered to perform.")}
      ${card("🎬","Content & Creative","Campaigns, video, and content that turns attention into action.")}
    </div>`),

  "work.html": pageShell("work.html","work.html","Work","Selected work from Millennials Creatives LLC.",
    "Selected work","Boring in. <em>Iconic</em> out.","A few of the products and brands we have engineered. (Add screenshots and case-study links as you go.)",
    `<div class="pg-grid">
      ${card("🩺","MedCompanion AI","A safety-first AI health companion — LangGraph + Claude — that helps patients understand their care and partner with their doctor.")}
      ${card("🤝","BarterThat","An AI-matched barter marketplace connecting people to trade skills and goods without cash.")}
      ${card("🧁","Three Wishes Bakery","Full brand identity and web experience for a nurse-owned California bakery.")}
      ${card("✦","[Your Client]","[Short result-focused blurb — what you did and the outcome.]")}
      ${card("✦","[Your Client]","[Short result-focused blurb.]")}
      ${card("✦","[Your Client]","[Short result-focused blurb.]")}
    </div>
    <p class="note">Tip: replace the bracketed cards with real projects and add links/images as case studies are ready.</p>`),

  "team.html": pageShell("team.html","team.html","Team","The credentialed co-founders behind Millennials Creatives LLC.",
    "Who we are","Four founders. <em>One</em> obsession.","Credentialed co-founders across brand, technology, healthcare, and operations. (Replace the placeholders with real names, roles, and bios.)",
    `<div class="pg-grid">
      ${card("👤","[Co-Founder Name]","[Role — e.g. Creative Director]. [One-line bio / credential.]")}
      ${card("👤","[Co-Founder Name]","[Role — e.g. Head of AI / Engineering]. [One-line bio.]")}
      ${card("👤","[Co-Founder Name]","[Role — e.g. Healthcare Lead]. [One-line bio.]")}
      ${card("👤","[Co-Founder Name]","[Role — e.g. Operations & Contracts]. [One-line bio.]")}
    </div>
    <p class="note">Send me the real names, roles, and short bios and I will drop them in.</p>`),

  "government.html": pageShell("government.html","government.html","Government Contracts","Woman-owned, minority-founded, SAM.gov-registered consulting for the public sector.",
    "Public sector","Government <em>ready.</em>","A woman-owned, minority-founded firm registered and ready to deliver for federal, state, and local agencies.",
    `<div class="capgrid">
      <div class="capbox"><div class="k">Status</div><div class="v">Woman-Owned · Minority-Founded</div></div>
      <div class="capbox"><div class="k">SAM.gov</div><div class="v">Registered &amp; Active</div></div>
      <div class="capbox"><div class="k">CAGE Code</div><div class="v">18ZQ0</div></div>
      <div class="capbox"><div class="k">Location</div><div class="v">Phoenix, AZ</div></div>
      <div class="capbox"><div class="k">UEI</div><div class="v">[Add your UEI]</div></div>
      <div class="capbox"><div class="k">NAICS</div><div class="v">[Add NAICS codes]</div></div>
    </div>
    <div class="pg-section"><h2>Core Competencies</h2>
      <div class="pg-grid">
        ${card("🎯","Brand & Communications","Public-facing campaigns, identity, and outreach for agencies and programs.")}
        ${card("🤖","AI & Digital Modernization","AI systems, automation, web apps, and accessible digital services.")}
        ${card("🩺","Health Programs","Health communication, patient-facing tools, and health-equity initiatives.")}
      </div>
    </div>
    <div class="pg-section"><h2>Let's work together</h2>
      <p class="pg-lead">Contracting officers and primes: reach us at <a href="mailto:contact@millennialscreatives.com" style="color:var(--yellow)">contact@millennialscreatives.com</a> for a capability statement.</p>
    </div>`),

  "packages.html": pageShell("packages.html","packages.html","Packages","Transparent packages from $5K brand builds to $100K+ government engagements.",
    "Packages & pricing","Pick your <em>level</em>.","From a fast brand spark to full government delivery — clear scopes, no mystery pricing.",
    `<div class="pg-grid">
      ${card("⚡","Spark","Brand identity for new and growing ventures.",`<div class="price">$5K+</div>`+ul(["Logo & identity system","Brand voice & messaging","One-page or landing site","Launch-ready assets"]))}
      ${card("🚀","Surge","Brand + digital for businesses ready to scale.",`<div class="price">$15–25K</div>`+ul(["Full brand system","Multi-page website / web app","Content & campaign kit","90-day growth plan"]))}
      ${card("🏗️","Scale","AI products & custom builds end to end.",`<div class="price">$50K+</div>`+ul(["Custom AI / software build","Product & UX design","Engineering & deployment","Ongoing iteration"]))}
      ${card("🏛️","Government / Enterprise","Public-sector & enterprise engagements.",`<div class="price">$100K+</div>`+ul(["Scoped to solicitation","Compliance-minded delivery","Dedicated team","Past-performance support"]))}
    </div>
    <p class="note">Custom scopes welcome — tell us your goal and budget and we will shape the right package.</p>`),

  "culture.html": pageShell("culture.html","culture.html","Culture","What Millennials Creatives stands for.",
    "How we move","Built <em>different.</em>","We are a woman-owned, minority-founded studio that treats every brand like it deserves to be iconic — because it does.",
    `<div class="pg-grid">
      ${card("🔥","Bold over boring","If it is safe and forgettable, we have not done our job yet.")}
      ${card("🤝","Partners, not vendors","We sit on your side of the table and own the outcome.")}
      ${card("🌍","Built for everyone","Representation and accessibility are defaults, not afterthoughts.")}
      ${card("⚙️","We ship","Strategy is nothing without a thing in the world. We build and launch.")}
      ${card("📈","Outcomes first","Pretty is the baseline. We are here to move the numbers.")}
      ${card("💛","Human","Real people, real care — in the work and with each other.")}
    </div>`),

  "contact.html": pageShell("contact.html","contact.html","Start a Project","Start a project with Millennials Creatives LLC.",
    "Start a project","Let's make it <em>iconic.</em>","Tell us what you are building. We reply fast.",
    `<div style="max-width:620px;margin-top:40px">
      <form onsubmit="return sendMail(event)">
        <div class="field"><label>Your name</label><input id="cf-name" required></div>
        <div class="field"><label>Email</label><input id="cf-email" type="email" required></div>
        <div class="field"><label>What do you need?</label>
          <select id="cf-type"><option>Brand & identity</option><option>Website / web app</option><option>AI / software build</option><option>Healthcare project</option><option>Government contract</option><option>Something else</option></select></div>
        <div class="field"><label>Budget (optional)</label><input id="cf-budget" placeholder="e.g. $5K, $25K, $100K+"></div>
        <div class="field"><label>Tell us about it</label><textarea id="cf-msg" rows="5" required></textarea></div>
        <button type="submit" class="btn-primary" style="background:var(--yellow);color:var(--dark);border:none">Send it →</button>
      </form>
      <p class="note">Prefer email? <a href="mailto:contact@millennialscreatives.com" style="color:var(--yellow)">contact@millennialscreatives.com</a> · Phoenix, AZ</p>
    </div>
    <script>
    function sendMail(e){e.preventDefault();
      var g=function(id){return document.getElementById(id).value;};
      var n=g('cf-name'),em=g('cf-email'),t=g('cf-type'),b=g('cf-budget'),m=g('cf-msg');
      var body=encodeURIComponent('Name: '+n+'\\nEmail: '+em+'\\nType: '+t+'\\nBudget: '+b+'\\n\\n'+m);
      window.location.href='mailto:contact@millennialscreatives.com?subject='+encodeURIComponent('New project inquiry from '+n)+'&body='+body;
      return false;}
    </script>`),
};

Object.entries(pages).forEach(([file, html]) => { fs.writeFileSync(file, html); console.log("wrote", file, html.length, "bytes"); });
console.log("done");
