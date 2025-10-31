const test = require('node:test');
const assert = require('node:assert/strict');

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this._children = [];
    this._text = '';
    this._className = '';
    this.attributes = Object.create(null);
    this.eventListeners = Object.create(null);
  }

  get children() {
    return this._children;
  }

  appendChild(child) {
    this._children.push(child);
    return child;
  }

  append(...children) {
    children.forEach(child => this.appendChild(child));
  }

  setAttribute(name, value) {
    const stringValue = String(value);
    this.attributes[name] = stringValue;
    if (name === 'id') {
      this.ownerDocument.elementsById[stringValue] = this;
    }
    if (name === 'class') {
      this.className = stringValue;
    }
  }

  getAttribute(name) {
    if (name === 'class') {
      return this._className || null;
    }
    return Object.prototype.hasOwnProperty.call(this.attributes, name)
      ? this.attributes[name]
      : null;
  }

  set className(value) {
    const previous = this._className ? this._className.split(/\s+/).filter(Boolean) : [];
    const next = value ? String(value).split(/\s+/).filter(Boolean) : [];
    this._className = value ? String(value) : '';
    this.ownerDocument.updateClassMembership(this, previous, next);
  }

  get className() {
    return this._className;
  }

  set textContent(value) {
    this._text = String(value);
    this._children = [];
  }

  get textContent() {
    const childText = this._children.map(child => child.textContent).join('');
    return `${this._text}${childText}`;
  }

  set innerHTML(value) {
    this._text = '';
    this._children = [];
  }

  get innerHTML() {
    return this.textContent;
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(handler);
  }

  dispatchEvent(eventName) {
    (this.eventListeners[eventName] || []).forEach(handler => handler());
  }
}

class FakeDocument {
  constructor() {
    this.elementsById = Object.create(null);
    this.classMap = new Map();
    this.listeners = { DOMContentLoaded: [] };
    this.body = new FakeElement('body', this);
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  getElementById(id) {
    return this.elementsById[id] || null;
  }

  querySelectorAll(selector) {
    if (selector.startsWith('.')) {
      const className = selector.slice(1);
      const members = this.classMap.get(className);
      return members ? Array.from(members) : [];
    }
    return [];
  }

  addEventListener(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  updateClassMembership(element, previousClasses, nextClasses) {
    previousClasses.forEach(cls => {
      const set = this.classMap.get(cls);
      if (set) {
        set.delete(element);
        if (set.size === 0) {
          this.classMap.delete(cls);
        }
      }
    });
    nextClasses.forEach(cls => {
      if (!this.classMap.has(cls)) {
        this.classMap.set(cls, new Set());
      }
      this.classMap.get(cls).add(element);
    });
  }
}

const createStorage = () => {
  const store = new Map();
  return {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: key => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    }
  };
};

let loadCart;
let saveCart;
let addToCart;
let updateCartCount;
let renderCart;

const loadModule = () => {
  delete require.cache[require.resolve('../vibethreads/script.js')];
  return require('../vibethreads/script.js');
};

test.beforeEach(t => {
  const document = new FakeDocument();
  const counter = document.createElement('span');
  counter.className = 'cart-count';
  document.body.appendChild(counter);

  const container = document.createElement('div');
  container.setAttribute('id', 'cart-items');
  document.body.appendChild(container);

  global.document = document;
  global.localStorage = createStorage();

  ({ loadCart, saveCart, addToCart, updateCartCount, renderCart } = loadModule());

  t.context = { document, counter, container };
});

test.afterEach(t => {
  delete global.document;
  delete global.localStorage;
  const context = t.context || {};
  context.document?.classMap?.clear?.();
});

test('loadCart returns empty array when storage is invalid', () => {
  global.localStorage.setItem('cart', 'not json');
  assert.deepEqual(loadCart(), []);
});

test('addToCart stores item and updates count accessibility metadata', () => {
  addToCart('Shirt', 20);
  assert.deepEqual(loadCart(), [{ name: 'Shirt', price: 20 }]);
  const counters = document.querySelectorAll('.cart-count');
  assert.strictEqual(counters[0].textContent, '1');
  assert.strictEqual(counters[0].getAttribute('aria-label'), '1 item in cart');
});

test('renderCart displays empty message when there are no items', () => {
  global.localStorage.clear();
  renderCart();
  const container = document.getElementById('cart-items');
  assert.match(container.textContent.trim(), /Your cart is empty\./);
});

test('renderCart lists items and total when items exist', () => {
  saveCart([
    { name: 'Tee', price: 10 },
    { name: 'Cap', price: 5.5 }
  ]);
  renderCart();
  const container = document.getElementById('cart-items');
  const list = container.children.find(child => child.className === 'cart-list');
  assert.ok(list, 'expected cart list to be rendered');
  assert.strictEqual(list.children.length, 2);
  const total = container.children.find(child => child.className === 'cart-summary');
  assert.ok(total, 'expected total element');
  assert.strictEqual(total.textContent, 'Total: $15.50');
});
