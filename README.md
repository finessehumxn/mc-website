# Millennials Creatives Website

The official website for **Millennials Creatives LLC**, a certified woman-owned
creative studio, software house, and government contractor based in Phoenix, Arizona.

Live at **[millennialscreatives.com](https://millennialscreatives.com)**

---

## What this is

A static HTML, CSS, and vanilla-JavaScript website. No build step, no framework,
no server. Every page is a plain `.html` file that can be edited directly and
deploys as-is.

- **Hosting:** Netlify, auto-deploying from this repository on every commit to `main`
- **Domain:** millennialscreatives.com (Netlify), with product subdomains on Railway
- **Stack:** hand-written HTML and CSS (Poppins / Unbounded / Space Grotesk) with
  small vanilla-JavaScript enhancements. No bundler, no dependencies to install.

## Structure

```
index.html                     Homepage
start-a-build.html             Custom Builds project wizard
government.html                Government capabilities
work.html, shop.html, blog.html, contact.html
industry-*.html                Industry pages
barterthat.html, finessekey.html, ...   Product pages
privacy.html, sms-terms.html, terms.html, accessibility.html
assets/                        Logos and brand imagery
media/apps/                    Product logos
media/brand/                   Brand art
media/video/                   Hero and showreel videos
.github/workflows/             Scheduled content automation
```

## Editing and deploying

Edit any `.html` file and commit to `main`. Netlify rebuilds and publishes within
about a minute. The simplest workflow is GitHub's web editor: open the file, edit,
commit. Always commit through Git rather than dragging files into Netlify, so the
repository stays the single source of truth.

## Automation

Two scheduled GitHub Actions live in `.github/workflows/`:

- **Daily culture refresh** updates the culture feed.
- **Weekly blog publish** publishes the next scheduled article.

These should only touch the blog and culture pages, never `index.html`.

## Brand

- Background `#080810` · Yellow `#FFD84D` · Pink `#FF2D78` · Cyan `#00D4FF`
- Display: Unbounded and Poppins · Body: Space Grotesk and Poppins
- Accessibility: Section 508 and WCAG 2.1 AA practices throughout

## Contact

Millennials Creatives LLC · Phoenix, AZ
contact@millennialscreatives.com · 602-800-0660
UEI WBGAAWMD3YE5 · CAGE 18ZQ0

Copyright 2020 to 2026 Millennials Creatives LLC. All rights reserved.
