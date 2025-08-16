const test = require('node:test');
const assert = require('node:assert/strict');
const { loadCart, saveCart, addToCart, updateCartCount } = require('../vibethreads/script.js');

// simple localStorage mock
let store = {};
const localStorageMock = {
  getItem: key => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  clear: () => { store = {}; }
};

// simple document mock
global.document = {
  querySelectorAll: () => [ { textContent: '' } ]
};

global.localStorage = localStorageMock;

test('loadCart returns empty array when storage is invalid', () => {
  localStorage.clear();
  localStorage.setItem('cart', 'not json');
  assert.deepEqual(loadCart(), []);
});

test('addToCart stores item and updates count', () => {
  localStorage.clear();
  const elements = [ { textContent: '' } ];
  document.querySelectorAll = () => elements;
  addToCart('Shirt', 20);
  assert.deepEqual(loadCart(), [{ name: 'Shirt', price: 20 }]);
  assert.strictEqual(elements[0].textContent, 1);
});
