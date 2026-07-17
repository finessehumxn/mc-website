# Stripe Added to Project Elevate, July 17, 2026

## What was wired
The four shop products now link to your live Stripe Payment Links
(same ones from the old site, already active on your Millennials
Creatives Stripe account):

- Win Your First Gov Contract ($97)
- LLC Legal Document Kit ($127)
- AI Tools for Small Business ($47)
- Small Business Starter Bundle ($197)

Each "Buy Now" button (in src/routes/shop.tsx) now opens the real
Stripe checkout in a new tab, instead of the old placeholder that
linked to /contact.

## Left as-is on purpose
The Pricing page ($5K to $100K+ service retainers and custom builds)
still routes to Contact for a discovery call. High-value services
should NOT be one-click checkout, that's the correct design.

## Also cleaned
Removed em/en dashes across the app's text per the no-dash rule
(price ranges are now hyphens, prose dashes became commas).

## To deploy
This is a React / TanStack app, it must be BUILT before it goes live:
  1. npm install
  2. npm run build
  3. deploy the built output to Netlify
Because this replaces your current plain-HTML site, deploying it is
a bigger step than the old file pushes. See notes with L.Finesse.
