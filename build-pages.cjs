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
    "Selected work","Boring in. <em>Iconic</em> out.","Products, brands, and visual systems we have engineered — from healthcare AI to packaging and motion design.",
    `<div class="pg-grid">
      ${card("🩺","MedCompanion AI","Safety-first AI health platform — LangGraph + Claude — that helps patients understand their care in plain language and partner with their doctor.",`<div class="tagrow"><span class="tag">AI Engineering</span><span class="tag">Healthcare</span></div>`)}
      ${card("🤝","BarterThat","AI-matched barter marketplace connecting people to trade skills and goods without cash.",`<div class="tagrow"><span class="tag">AI</span><span class="tag">Marketplace</span></div>`)}
      ${card("🧁","Three Wishes Bakery","Full brand identity and web experience for a nurse-owned California bakery.",`<div class="tagrow"><span class="tag">Brand Identity</span><span class="tag">Web</span></div>`)}
      ${card("🌀","Retro Culture Collection","Nostalgia-driven visual collection blending vintage type with modern 3D craft.",`<div class="tagrow"><span class="tag">3D Design</span><span class="tag">Motion</span></div>`)}
      ${card("✨","Gold Explosion Series","High-impact 3D visual system built around luxury, light, and motion.",`<div class="tagrow"><span class="tag">3D Design</span><span class="tag">Visual Systems</span></div>`)}
      ${card("📦","Product Visual Identity","Product branding and packaging that makes shelves stop people.",`<div class="tagrow"><span class="tag">Product Branding</span><span class="tag">Packaging</span></div>`)}
      ${card("💃","The Wendy S Collection","Bold personal brand identity and social presence with a signature look.",`<div class="tagrow"><span class="tag">Brand Identity</span><span class="tag">Social</span></div>`)}
      ${card("🎀","Bella High","Playful, premium brand identity and product styling.",`<div class="tagrow"><span class="tag">Brand Identity</span><span class="tag">Product</span></div>`)}
      ${card("🎥","We Are Finesse","Content, social, and video building a movement-driven brand presence.",`<div class="tagrow"><span class="tag">Content</span><span class="tag">Video</span></div>`)}
      ${card("🌿","Fruitful Remedies","Wellness packaging and label design with a clean, natural identity.",`<div class="tagrow"><span class="tag">Packaging</span><span class="tag">Label Design</span></div>`)}
      ${card("✅","First Choice","Packaging and brand identity built for trust and clarity.",`<div class="tagrow"><span class="tag">Packaging</span><span class="tag">Brand Identity</span></div>`)}
      ${card("📻","LesTalk Radio","Graphic design and print identity for an on-air brand.",`<div class="tagrow"><span class="tag">Graphic Design</span><span class="tag">Print</span></div>`)}
    </div>`),

  "team.html": pageShell("team.html","team.html","Team","The credentialed co-founders behind Millennials Creatives LLC.",
    "Who we are","Four founders. <em>One</em> obsession.","Credentialed co-founders spanning AI engineering, clinical nursing, institutional governance, and public health — a depth no pure creative agency can match.",
    `<div class="pg-grid">
      ${card("👤","L. Finesse Humxn","<b>Co-Founder · AI Engineer · CEO</b><br>Founder and CEO of Millennials Creatives. AI engineer, brand strategist, and digital infrastructure architect with deep expertise in CRM systems, automation, and government consulting. Leads all client-facing engagements and proposal development.")}
      ${card("👤","Jeanie Vatelia","<b>Co-Founder · BSN, RN, PHN</b><br>Registered Nurse and Public Health Nurse with clinical practice, community health program design, and healthcare regulatory compliance experience. Brings clinical credibility no pure consulting firm can match.")}
      ${card("👤","Londa Rozier-Taylor","<b>Co-Founder · MBA · MS Nonprofit Leadership</b><br>Institutional governance, financial operations, and organizational change management for public-sector and higher-education engagements.")}
      ${card("👤","Vannessa Rozier-Taylor","<b>Co-Founder · MS Public Health &amp; Safety</b><br>Public-health program evaluation, emergency preparedness, safety systems management, and policy analysis. MC's lead for safety and public-health engagements.")}
    </div>`),

  "government.html": pageShell("government.html","government.html","Government Contracts","Woman-owned, minority-founded, SAM.gov-registered consulting for the public sector.",
    "Public sector","Government <em>ready.</em>","A woman-owned, minority-founded firm registered and ready to deliver for federal, state, and local agencies.",
    `<div class="capgrid">
      <div class="capbox"><div class="k">Status</div><div class="v">Woman-Owned · Minority-Founded</div></div>
      <div class="capbox"><div class="k">SAM.gov</div><div class="v">Registered &amp; Active</div></div>
      <div class="capbox"><div class="k">UEI</div><div class="v">WBGAAWMD3YE5</div></div>
      <div class="capbox"><div class="k">CAGE Code</div><div class="v">18ZQ0</div></div>
      <div class="capbox"><div class="k">Location</div><div class="v">Phoenix, AZ</div></div>
      <div class="capbox"><div class="k">NAICS (Primary)</div><div class="v">541611 · 541613</div></div>
    </div>
    <div class="pg-section"><h2>NAICS Codes</h2>
      <div class="tagrow" style="margin-top:8px">
        <span class="tag">541611 — Admin & Management Consulting</span>
        <span class="tag">541613 — Marketing Consulting</span>
        <span class="tag">541430 — Graphic Design</span>
        <span class="tag">541519 — IT Consulting</span>
        <span class="tag">621999 — Healthcare Services</span>
        <span class="tag">923120 — Public Health Administration</span>
        <span class="tag">611430 — Professional Development Training</span>
        <span class="tag">541612 — HR Consulting</span>
      </div>
    </div>
    <div class="pg-section"><h2>Core Competencies</h2>
      <div class="pg-grid">
        ${card("🎯","Brand & Communications","Public-facing campaigns, identity, and outreach for agencies and programs.")}
        ${card("🤖","AI & Digital Modernization","AI systems, automation, web apps, and accessible digital services.")}
        ${card("🩺","Health Programs","Health communication, patient-facing tools, and health-equity initiatives — backed by a Registered Nurse co-founder.")}
        ${card("🛡️","Public Health & Safety","Program evaluation, emergency preparedness, and policy analysis from credentialed public-health leadership.")}
        ${card("🏛️","Governance & Operations","Institutional governance, financial operations, and organizational change management.")}
        ${card("🎓","Training & Development","Professional development and workforce training for public-sector teams.")}
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
