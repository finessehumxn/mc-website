import os

FILE = os.path.join('frontend', 'index.html')
with open(FILE, 'r', encoding='utf-8') as f:
    h = f.read()

# Add PWA meta tags before </head>
pwa_head = '''<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0D4855">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="MedCompanion AI">'''

# Add service worker before </body>
pwa_sw = '''<script>
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
</script>'''

if 'manifest.json' not in h:
    h = h.replace('</head>', pwa_head + '\n</head>')
    h = h.replace('</body>', pwa_sw + '\n</body>')
    with open(FILE, 'w', encoding='utf-8') as f:
        f.write(h)
    print("PWA tags added")
else:
    print("Already present")
