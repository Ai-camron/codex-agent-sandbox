function loadCart() {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = loadCart();
  cart.push({ name, price });
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const count = loadCart().length;
  if (typeof document === 'undefined') {
    return count;
  }
  const label = `${count} ${count === 1 ? 'item' : 'items'} in cart`;
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    if (typeof el.setAttribute === 'function') {
      el.setAttribute('aria-label', label);
    }
  });
  return count;
}

function renderCart() {
  if (typeof document === 'undefined') {
    return;
  }
  const container = document.getElementById('cart-items');
  if (!container) {
    return;
  }
  container.innerHTML = '';
  const cart = loadCart();
  if (!Array.isArray(cart) || cart.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'lead-text';
    emptyMessage.textContent = 'Your cart is empty.';
    container.appendChild(emptyMessage);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'cart-list';
  let total = 0;

  cart.forEach(item => {
    if (!item || typeof item.price !== 'number') {
      return;
    }
    const name = typeof item.name === 'string' && item.name.trim() ? item.name : 'Item';
    total += item.price;

    const listItem = document.createElement('li');
    listItem.className = 'cart-list__item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'cart-item__name';
    nameSpan.textContent = name;

    const priceSpan = document.createElement('span');
    priceSpan.className = 'cart-item__price';
    priceSpan.textContent = `$${item.price.toFixed(2)}`;

    listItem.append(nameSpan, priceSpan);
    list.appendChild(listItem);
  });

  if (!list.children.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'lead-text';
    emptyMessage.textContent = 'Your cart is empty.';
    container.appendChild(emptyMessage);
    return;
  }

  container.appendChild(list);

  const totalEl = document.createElement('p');
  totalEl.className = 'cart-summary';
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
  container.appendChild(totalEl);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);
        if (!Number.isFinite(price)) {
          return;
        }
        addToCart(name, price);
      });
    });
  });
}

if (typeof module !== 'undefined') {
  module.exports = { loadCart, saveCart, addToCart, updateCartCount, renderCart };
}
