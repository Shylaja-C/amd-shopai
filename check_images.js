const fs = require('fs');
const https = require('https');

const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
const urls = [...new Set(products.map(p => p.image))];

console.log(`Checking ${urls.length} unique URLs...`);

let checked = 0;
urls.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode !== 200 && res.statusCode !== 301 && res.statusCode !== 302) {
      console.log(`FAILED (${res.statusCode}): ${url}`);
    }
    checked++;
    if (checked === urls.length) {
      console.log('Done checking.');
    }
  }).on('error', (e) => {
    console.log(`ERROR: ${url} - ${e.message}`);
    checked++;
    if (checked === urls.length) {
      console.log('Done checking.');
    }
  });
});
