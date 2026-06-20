// One-off: pull embedded JPEGs out of the media kit PDF for real work thumbnails.
const fs = require("fs");
const SRC = "C:/Users/lfine/OneDrive/Desktop/New folder/mc-media-kit-1.pdf";
const buf = fs.readFileSync(SRC);
let imgs = [], i = 0;
while (i < buf.length - 1) {
  if (buf[i] === 0xFF && buf[i + 1] === 0xD8 && buf[i + 2] === 0xFF) {
    let j = i + 2;
    while (j < buf.length - 1) { if (buf[j] === 0xFF && buf[j + 1] === 0xD9) { j += 2; break; } j++; }
    const len = j - i;
    if (len > 8000) imgs.push({ len, data: buf.slice(i, j) });
    i = j;
  } else i++;
}
imgs.sort((a, b) => b.len - a.len);
fs.mkdirSync("media", { recursive: true });
const top = imgs.slice(0, 30);
top.forEach((im, k) => fs.writeFileSync(`media/kit-${k}.jpg`, im.data));
console.log("found", imgs.length, "jpegs; wrote", top.length);
top.forEach((im, k) => console.log(`kit-${k}.jpg`, ((im.len / 1024) | 0) + "KB"));
