/**
 * One-off: extrai .services-detail__modal-data para content/modals/*.html
 * Run: node scripts/extract-service-modals.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const modalsDir = path.join(root, 'content', 'modals');

const MARKER = '<div class="services-detail__modal-data" hidden>';
const html = fs.readFileSync(indexPath, 'utf8');

if (!fs.existsSync(modalsDir)) {
  fs.mkdirSync(modalsDir, { recursive: true });
}

function findMatchingCloseDiv(source, openIndex) {
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = openIndex;
  let depth = 0;
  let match;

  while ((match = tagRe.exec(source)) !== null) {
    const tag = match[0];
    if (tag.startsWith('</div')) {
      depth -= 1;
      if (depth === 0) return match.index + tag.length;
    } else if (!tag.endsWith('/>') && !/\/>$/.test(tag)) {
      depth += 1;
    }
  }

  return -1;
}

const articleRe = /<article class="services-detail__item" id="(site-[^"]+)"([^>]*)>/g;
const replacements = [];
let m;

while ((m = articleRe.exec(html)) !== null) {
  const id = m[1];
  const attrs = m[2];
  const modalStart = html.indexOf(MARKER, m.index);
  if (modalStart === -1) continue;

  const innerStart = modalStart + MARKER.length;
  const modalEnd = findMatchingCloseDiv(html, modalStart);
  if (modalEnd === -1) {
    console.error('Failed to parse modal for', id);
    process.exit(1);
  }

  const inner = html.slice(innerStart, modalEnd - '</div>'.length).trim();
  const modalFile = path.join(modalsDir, `${id}.html`);
  fs.writeFileSync(modalFile, `${inner}\n`, 'utf8');

  const dataModalSrc = ` data-modal-src="content/modals/${id}.html"`;
  let newAttrs = attrs;
  if (!/\bdata-modal-src=/.test(attrs)) {
    newAttrs = `${attrs}${dataModalSrc}`;
  }

  replacements.push({
    id,
    modalStart,
    modalEnd,
    articleOpen: m.index,
    articleOpenEnd: m.index + m[0].length,
    newArticleOpen: `<article class="services-detail__item" id="${id}"${newAttrs}>`,
  });
}

replacements.sort((a, b) => b.modalStart - a.modalStart);

let out = html;
for (const r of replacements) {
  out = out.slice(0, r.modalStart) + out.slice(r.modalEnd);
  const openLen = r.articleOpenEnd - r.articleOpen;
  out = out.slice(0, r.articleOpen) + r.newArticleOpen + out.slice(r.articleOpen + openLen);
}

fs.writeFileSync(indexPath, out, 'utf8');
console.log(`Extracted ${replacements.length} modals to content/modals/`);
