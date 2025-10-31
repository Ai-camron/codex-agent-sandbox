const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const pages = ['index.html', 'shop.html', 'about.html', 'contact.html', 'product.html', 'cart.html'];
const rootDir = path.join(__dirname, '..', 'vibethreads');

async function readPage(page) {
  const filePath = path.join(rootDir, page);
  return fs.readFile(filePath, 'utf8');
}

test('HTML pages include required accessibility landmarks and attributes', async () => {
  const results = await Promise.all(pages.map(async page => {
    const html = await readPage(page);
    return { page, html };
  }));

  results.forEach(({ page, html }) => {
    assert.ok(html.includes('class="skip-link"') && html.includes('href="#main-content"'), `${page} is missing skip link to main content`);
    assert.ok(/<main[^>]*id="main-content"/i.test(html), `${page} is missing identifiable main landmark`);
    assert.ok(/<nav[^>]*aria-label="Primary navigation"/i.test(html), `${page} navigation requires aria-label`);
    assert.ok(html.includes('class="cart-count"') && /aria-live="polite"/.test(html), `${page} cart counter should announce updates`);
    assert.ok(/aria-current="page"/.test(html), `${page} should highlight the current navigation item`);
    assert.ok(/<meta[^>]*name="viewport"[^>]*initial-scale=1\.0/i.test(html), `${page} is missing responsive viewport meta tag`);
  });
});

test('Navigation links use extensionless slugs', async () => {
  const results = await Promise.all(pages.map(async page => {
    const html = await readPage(page);
    return { page, html };
  }));

  const allowlist = ['http://', 'https://', 'mailto:', '#', 'tel:', 'style.css', 'script.js'];

  results.forEach(({ page, html }) => {
    const links = html.match(/href="[^"]+"/g) || [];
    links.forEach(rawLink => {
      const href = rawLink.slice(6, -1);
      const isAllowed = allowlist.some(prefix => href.startsWith(prefix) || href.endsWith(prefix));
      if (!isAllowed) {
        assert.ok(!href.includes('.html'), `${page} should not link to .html routes: ${href}`);
      }
    });
  });
});

test('Contact page form fields are properly labelled', async () => {
  const html = await readPage('contact.html');
  ['name', 'email', 'message'].forEach(field => {
    const labelPattern = new RegExp(`<label[^>]*for="${field}"`, 'i');
    const controlPattern = new RegExp(`id="${field}"`, 'i');
    assert.ok(labelPattern.test(html), `contact.html missing label for ${field}`);
    assert.ok(controlPattern.test(html), `contact.html missing input control with id ${field}`);
  });
});

test('Cart page exposes accessible status region', async () => {
  const html = await readPage('cart.html');
  assert.ok(/id="cart-items"[^>]*aria-live="polite"[^>]*aria-labelledby="cart-heading"/i.test(html), 'cart.html requires aria-live region tied to heading');
});

test('Styles define legible color system and focus states', async () => {
  const cssPath = path.join(rootDir, 'style.css');
  const css = await fs.readFile(cssPath, 'utf8');
  assert.ok(/color-scheme:\s*dark/.test(css), 'color scheme should be set for consistent rendering');
  assert.ok(/body\s*{[^}]*color:\s*var\(--color-text\)/s.test(css), 'body text color should be defined via CSS variable');
  assert.ok(/body\s*{[^}]*background:[^;]*linear-gradient/s.test(css), 'body should have high-contrast background gradient');
  assert.ok(/\.product-card\s*{[^}]*background:\s*var\(--color-surface-alt\)/s.test(css), 'product cards need dedicated surface color');
  assert.ok(/\.cart-container\s*{[^}]*background:\s*var\(--color-surface-alt\)/s.test(css), 'cart container should have contrasting background');
  assert.ok(/\.skip-link[^}]*background-color:[^;]+/s.test(css), 'skip link requires visible background color');
  assert.ok(/:focus-visible/.test(css), 'focus-visible selectors should be present for keyboard users');
  assert.ok(/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css), 'styles should honour reduced motion preferences');
});
