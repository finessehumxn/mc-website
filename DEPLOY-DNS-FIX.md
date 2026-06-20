# Domain fix — make millennialscreatives.com redirect cleanly to mcre8.com

**Goal:** `mcre8.com` stays the primary public site (it already works 100%). `millennialscreatives.com`
should redirect to it on **every** path with valid HTTPS — instead of today's broken setup that
404s deep links and flips the address bar.

**Why the change:** GoDaddy "Domain Forwarding" only redirects the homepage. It 404s
`millennialscreatives.com/work.html`, `/capability.html`, etc. We replace it with **Netlify's**
domain-alias redirect, which preserves the full path and gets a free SSL cert.

---

## Step 1 — Netlify (add the domain as an alias)

1. Go to **app.netlify.com** → open the site **mcre8** (the one serving mcre8.com).
2. Left menu → **Domain management** (or **Site configuration → Domain management**).
3. Confirm **`mcre8.com` is set as the Primary domain** (there's a "Set as primary" option). Keep it primary.
4. Click **Add a domain** / **Add domain alias** and add BOTH:
   - `millennialscreatives.com`
   - `www.millennialscreatives.com`
   - When Netlify asks "is this yours / add anyway," continue — it's yours.
5. Netlify will list them as **domain aliases**. Because mcre8.com is primary, Netlify will
   **automatically 301-redirect** every alias path → the same path on mcre8.com.

> Result wanted: `millennialscreatives.com/anything` → `mcre8.com/anything` (path kept, SSL valid).

---

## Step 2 — GoDaddy (point DNS at Netlify, delete the forwarding)

1. **godaddy.com** → sign in → **My Products** → `millennialscreatives.com` → **DNS** (Manage DNS).
2. **DELETE the Forwarding rule** (Domain → Forwarding → trash the rule that sends it to mcre8.com).
   *This is the step that fixes the 404s.*
3. In the DNS **Records** table, set:

   | Type  | Name | Value                 | TTL     |
   |-------|------|-----------------------|---------|
   | A     | `@`  | `75.2.60.5`           | 1 hour  |
   | CNAME | `www`| `mcre8.netlify.app`   | 1 hour  |

   - If an existing `A @` record points somewhere else (e.g. `15.197.x.x` / a Parked/Forwarding IP),
     **edit it** to `75.2.60.5`. Remove any extra/duplicate `A @` records.
   - If a `CNAME www` already points to `mcre8.netlify.app`, leave it.
   - Remove any "Parked"/AfternicNS or forwarding leftovers for `@` and `www`.

---

## Step 3 — Wait + verify (~10–30 min, sometimes up to a few hours)

Netlify auto-issues a Let's Encrypt SSL cert once DNS points at it. Then test:

- `https://millennialscreatives.com/`            → should redirect to `https://mcre8.com/`
- `https://millennialscreatives.com/work.html`   → should redirect to `https://mcre8.com/work.html` (NOT 404)
- `https://millennialscreatives.com/capability.html` → redirects to the live capability statement
- Padlock (valid HTTPS) shows on millennialscreatives.com with no warning

Tell me when DNS is changed and I'll re-run the live checks to confirm all paths resolve.

---

## Reference — current verified state (2026-06-20)

- **Host:** Netlify, site `mcre8.netlify.app`, auto-deploys from GitHub repo `finessehumxn/mc-website` on push.
- **mcre8.com:** fully live, all pages + images return HTTP 200. ✅
- **millennialscreatives.com:** GoDaddy Forwarding → root redirects to mcre8.com, but **all deep links 404**; `www` has no SSL. ← what Steps 1–2 fix.
- Netlify apex IP used above: `75.2.60.5` (Netlify's load balancer; `99.83.190.102` is the documented alternate).
