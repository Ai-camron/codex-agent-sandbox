function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
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
}

function updateCartCount() {
  const count = loadCart().length;
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

if (typeof document !== "undefined") {
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart(name, price);
    });
  });
});
}


if (typeof module !== "undefined") {
  module.exports = { loadCart, saveCart, addToCart, updateCartCount };
}
