import fs from 'node:fs';

const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replace(
  /(<article class="services-detail__item" id="site-[^"]+"[^>]*>[\s\S]*?<h3>[^<]*<\/h3>)\s*<p>[\s\S]*?<\/p>\s*<ul>[\s\S]*?<\/ul>\s*/g,
  '$1\n',
);

fs.writeFileSync(path, html);
console.log(fs.statSync(path).size);
