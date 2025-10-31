const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const htmlPath = path.join(__dirname, '..', 'index.html');
const cssPath = path.join(__dirname, '..', 'styles.css');
const jsPath = path.join(__dirname, '..', 'main.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

test('HTML references combined assets', () => {
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.match(html, /<script defer src="main\.js"><\/script>/);
});

test('Accessible navigation structure exists', () => {
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<nav[^>]+aria-label="Main"/);
  assert.match(html, /class="nav-toggle"[\s\S]*aria-controls="primary-navigation"/);
  assert.match(html, /class="pop-trigger"[\s\S]*aria-haspopup="true"/);
});

test('Hero section contains required CTA buttons', () => {
  assert.match(html, /class="hero-campaign"/);
  assert.match(html, /Shop New Arrivals/);
  assert.match(html, /Browse All/);
});

test('Newsletter form includes accessible labelling and status region', () => {
  assert.match(html, /class="newsletter-form"/);
  assert.match(html, /<label class="sr-only" for="email">Email<\/label>/);
  assert.match(html, /id="newsletter-status" role="status" aria-live="polite"/);
});

test('CSS defines key layout and interaction classes', () => {
  [
    '.site-header',
    '.primary-nav',
    '.tile-card',
    '.animate-on-scroll',
    '.newsletter-form button.success'
  ].forEach((selector) => {
    assert.ok(css.includes(selector), `Expected ${selector} styles to be present`);
  });
});

test('JavaScript wires up required behaviors', () => {
  assert.match(js, /navToggle/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /newsletterForm/);
});
