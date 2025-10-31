const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const cssPath = path.join(__dirname, '..', 'wordpress', 'cebastian', 'additional-css.css');
const css = fs.readFileSync(cssPath, 'utf8');

test('Additional CSS has balanced braces', () => {
  const openings = (css.match(/\{/g) || []).length;
  const closings = (css.match(/\}/g) || []).length;
  assert.strictEqual(openings, closings, 'CSS braces must be balanced to avoid broken styles.');
});

test('Additional CSS keeps focus outlines and supports keyboard navigation', () => {
  assert.ok(!/outline\s*:\s*none/.test(css), 'Focus outlines should never be removed outright for accessibility.');
  const focusVisibleBlock = css.match(/:focus-visible\s*\{[^}]+\}/);
  assert.ok(focusVisibleBlock, 'Expected :focus-visible styles to aid keyboard users.');
  assert.ok(/outline/.test(focusVisibleBlock[0]), 'Focus-visible styles must include an outline declaration.');
  assert.ok(css.includes('.skip-link'), 'Skip link styles are required for quick content access.');
});

test('Additional CSS respects reduced motion preferences', () => {
  const reducedMotionBlock = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)[^}]*\{[\s\S]*?\}/);
  assert.ok(reducedMotionBlock, 'Expected a prefers-reduced-motion media query to limit animations.');
  assert.ok(/animation:\s*none\s*!important/.test(reducedMotionBlock[0]), 'Reduced motion block should disable animations.');
});

test('Additional CSS uses valid hex color values', () => {
  const hexMatches = css.match(/#[0-9a-fA-F]+/g) || [];
  const allowedLengths = new Set([4, 7, 9]);
  for (const hex of hexMatches) {
    assert.ok(allowedLengths.has(hex.length), `Unexpected hex color format detected: ${hex}`);
  }
});
