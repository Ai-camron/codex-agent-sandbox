const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');

test('page includes a skip link targeting main content', () => {
  assert.match(html, /<a[^>]*(?=[^>]*href="#main")(?=[^>]*class="[^"]*skip-link[^"]*")/i);
});

test('main landmark is present with role and id', () => {
  assert.match(html, /<main[^>]*id="main"[^>]*role="main"/i);
});

test('navigation provides accessible labelling', () => {
  assert.match(html, /<nav[^>]*aria-label="Primary"/i);
  assert.match(html, /<a[^>]*aria-label="CEBASTIAN home"/i);
});

test('newsletter form exposes live status for assistive tech', () => {
  assert.match(html, /role="status"/i);
  assert.match(html, /aria-live="polite"/i);
});

test('hero call-to-action has descriptive aria-label', () => {
  assert.match(html, /class="[^"]*hero-cta[^"]*"[^>]*aria-label="Explore collection in the Shop section"/i);
});
