const CART_KEY = "plantCart";

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartUI();
}

function getCartCount() {
  return getCart().reduce((total, item) => total + (item.qty || 0), 0);
}

function addToCart(product, qty) {
  const amount = Math.max(1, Number(qty) || 1);
  const items = getCart();
  const existing = items.find((item) => item.id === product.id);
  const image = normalizeImagePath(product.image);

  if (existing) {
    existing.qty += amount;
    if (image) existing.image = image;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: image,
      qty: amount
    });
  }

  saveCart(items);
}

function normalizeImagePath(path) {
  if (!path) return "";
  const file = String(path).split("/").pop();
  return "../images/" + file;
}

function removeFromCart(id) {
  const items = getCart().filter((item) => item.id !== id);
  saveCart(items);
}

function changeCartQty(id, delta) {
  const items = getCart();
  const item = items.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    saveCart(items.filter((entry) => entry.id !== id));
    return;
  }

  saveCart(items);
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");
  if (!badge) return;

  const count = getCartCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

function renderCartPanel() {
  const list = document.querySelector(".cart-items");
  const empty = document.querySelector(".cart-empty");
  const items = getCart();

  if (!list || !empty) return;

  list.innerHTML = "";

  if (items.length === 0) {
    empty.hidden = false;
    list.hidden = true;
    return;
  }

  empty.hidden = true;
  list.hidden = false;

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML =
      '<img src="' +
      item.image +
      '" alt="' +
      item.name +
      '" class="cart-item-img">' +
      '<div class="cart-item-info">' +
      '<span class="cart-item-name">' +
      item.name +
      "</span>" +
      (item.price
        ? '<span class="cart-item-price">₹' + item.price + "</span>"
        : "") +
      '<div class="cart-item-qty">' +
      '<button type="button" class="cart-qty-minus" data-id="' +
      item.id +
      '" aria-label="Decrease quantity">−</button>' +
      "<span>" +
      item.qty +
      "</span>" +
      '<button type="button" class="cart-qty-plus" data-id="' +
      item.id +
      '" aria-label="Increase quantity">+</button>' +
      "</div>" +
      "</div>" +
      '<button class="cart-remove" data-id="' +
      item.id +
      '" aria-label="Remove ' +
      item.name +
      ' from cart">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"></line>' +
      '<line x1="6" y1="6" x2="18" y2="18"></line>' +
      "</svg>" +
      "</button>";

    list.appendChild(li);
  });
}

function updateCartUI() {
  updateCartBadge();
  renderCartPanel();
}

function openCartPanel() {
  const panel = document.querySelector(".cart-panel");
  const overlay = document.querySelector(".cart-overlay");
  if (panel) panel.classList.add("open");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCartPanel() {
  const panel = document.querySelector(".cart-panel");
  const overlay = document.querySelector(".cart-overlay");
  if (panel) panel.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();

  const qtyValue = document.getElementById("qty-value");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const addBtn = document.getElementById("add-to-cart");

  if (qtyMinus && qtyValue) {
    qtyMinus.addEventListener("click", () => {
      let n = Number(qtyValue.textContent) || 1;
      if (n > 1) qtyValue.textContent = String(n - 1);
    });
  }

  if (qtyPlus && qtyValue) {
    qtyPlus.addEventListener("click", () => {
      let n = Number(qtyValue.textContent) || 1;
      qtyValue.textContent = String(n + 1);
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const qty = qtyValue ? Number(qtyValue.textContent) || 1 : 1;
      addToCart(
        {
          id: addBtn.dataset.id,
          name: addBtn.dataset.name,
          price: addBtn.dataset.price,
          image: addBtn.dataset.image
        },
        qty
      );
      addBtn.textContent = "Added ✓";
      setTimeout(() => {
        addBtn.textContent = "Add to cart";
      }, 1000);
    });
  }

  const cartToggle = document.querySelector(".cart-link");
  if (cartToggle) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault();
      openCartPanel();
    });
  }

  const closeBtn = document.querySelector(".cart-close");
  const overlay = document.querySelector(".cart-overlay");

  if (closeBtn) closeBtn.addEventListener("click", closeCartPanel);
  if (overlay) overlay.addEventListener("click", closeCartPanel);

  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".cart-remove");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
      return;
    }

    const minusBtn = e.target.closest(".cart-qty-minus");
    if (minusBtn) {
      changeCartQty(minusBtn.dataset.id, -1);
      return;
    }

    const plusBtn = e.target.closest(".cart-qty-plus");
    if (plusBtn) {
      changeCartQty(plusBtn.dataset.id, 1);
    }
  });
});
