# MC Website — Complete Rebuild (July 16, 2026)

This folder is the ENTIRE millennialscreatives.com site, finished in one pass.
Hand it to anyone (developer, VA, co-founder) or push it to GitHub yourself —
it replaces the mc-website repo contents one-for-one.

## What was done

1. EVERY EMOJI REMOVED — all 43 pages. Icons are now clean typographic
   labels (small gold chips) that match the site's existing style.

2. THE ROOT CAUSE FIXED — the automated scripts build-pages.cjs and
   build-culture.cjs had the emojis baked in, so every time the daily
   culture bot ran, emojis came back. Both scripts are now emoji-free.
   They cannot come back.

3. PORTFOLIO NOW SHOWS ALL THE WORK (work.html):
   - 01 Client Websites & Platforms (+ Fortune Firearms concept added)
   - 02 Brand & Identity Design (NEW): Wendy S Collection, Secret Miracles,
     Ernise Cummings LLC, Fruitful Remedies, First Choice, LesTalk Radio,
     Finesse Our Minds (formerly We Are Finesse), Bella High content
   - 03 Media Production (NEW): Henry County Election Debate, Henry County
     NAACP, NCCW Marathon, Micro School GA, Texas Ranch Wedding,
     South Florida Going Away Package
   - 04 Products We Ship (+ EmoSafe AI and AI Failure Analysis research)
   - 05 Design to Production (Bella High 3D)
   - 06 Government & Public Sector

4. NOTHING BROKEN — all 4 live Stripe checkout links verified intact,
   all product downloads still in place, app icons swapped in for the
   Finesse Key and UpSide Down cards on the services page.

## One caution for whoever deploys

build-pages.cjs is an OLDER generator that still contains named team
cards. The live site uses the anonymized team page. Do NOT run
"node build-pages.cjs" — it would overwrite current pages with older
content. The daily culture bot (build-culture.cjs) is safe and now
emoji-free.
