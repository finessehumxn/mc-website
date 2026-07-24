BID-IN-A-BOX, SITE INSTALLATION (5 simple steps, no code)
This pack adds the new $147 product to millennialscreatives.com with working delivery.

WHAT'S IN THIS PACK (5 files to upload):
  bid-system.html   = THE PRODUCT: the full online course (8 modules, 30+ lessons, checks, assignments, certificate; progress saves in the buyer's browser)
  bid-in-a-box.zip  = the 12-file template arsenal the system deploys (playbook + 7 Word templates + tracker + worksheet + emails)
  shop.html         = shop page with the new Bid-in-a-Box card (pink, top of the grid)
  checkout.html     = checkout page that knows the new product
  thankyou.html     = delivery page that serves the new download

STEP 1, UPLOAD (2 minutes):
  Go to github.com/finessehumxn/mc-website
  Click "Add file" then "Upload files"
  Drag ALL FIVE files from this pack in
  Scroll down, click "Commit changes"
  Netlify redeploys automatically in about a minute.
  THE PRODUCT IS NOW LIVE. Until Step 2 is done, the buy button says
  "Order by Email" and orders arrive at contact@ (you invoice, then send
  them millennialscreatives.com/thankyou.html?p=bidbox). Nothing is broken
  while you finish Step 2.

STEP 2, CREATE THE STRIPE LINK (3 minutes):
  Stripe Dashboard > Product catalog > "+ Add product"
    Name: Bid-in-a-Box, the Complete System | Price: $147, one time
  Then Payment Links > "+ New" > pick the product
    IMPORTANT, under "After payment": select "Redirect customers to your website"
    Paste exactly:  https://millennialscreatives.com/thankyou.html?p=bidbox
  Click Create, then COPY the new buy.stripe.com link.

STEP 3, PASTE THE LINK (2 minutes):
  In the GitHub repo, click checkout.html, then the pencil (Edit) icon
  Press Ctrl+F (Cmd+F on Mac), search:  PASTE_STRIPE_LINK_BIDBOX
  Replace that whole placeholder (keep the quotes around it) with your
  copied buy.stripe.com link. Commit changes. One-click checkout is now live.

STEP 4, TEST IT (3 minutes):
  Open millennialscreatives.com/shop.html, click Get the System,
  buy it yourself with a real card, confirm you land on the thank-you page,
  download the zip, open the PDF. Then refund yourself in Stripe
  (Payments > the charge > Refund). Delivery is now PROVEN.

STEP 5 (optional): tell Claude the price if you want something other than
  $147, and whether to add Bid-in-a-Box into the $197 bundle, both are
  60-second updates.

UPLOAD ORDER NOTE: if you also upload the earlier mc-update-v5.zip, upload
v5 FIRST and this pack SECOND. If the shop page then looks different than
expected, say the word and Claude merges them in minutes.
