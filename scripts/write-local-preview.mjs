import { readFileSync, writeFileSync } from 'node:fs';

const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="FREYRAUM — Immersive Digital Exhibition Platform" />
  <title>freyraum — immersive gallery</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <div id="app"></div>
  <script src="./freyraum-gallery.js"></script>
</body>
</html>
`;

const bundlePath = 'customer-preview/freyraum-gallery.js';
const secureRandom = `function freyraumSecureRandom(){const cryptoApi=globalThis.crypto;if(cryptoApi&&cryptoApi.getRandomValues){const values=new Uint32Array(1);cryptoApi.getRandomValues(values);return values[0]/4294967296}const now=Date.now();const perf=globalThis.performance&&globalThis.performance.now?globalThis.performance.now():0;return (Math.sin(now+perf)*10000)%1}\n`;
const bundle = readFileSync(bundlePath, 'utf8')
  .replaceAll('Math.random()', 'freyraumSecureRandom()');

writeFileSync(bundlePath, secureRandom + bundle);
writeFileSync('customer-preview/app.html', html);
