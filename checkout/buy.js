const CART_KEY = "plantCart";

function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function clearCart() {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
}

function getCartTotal(items) {
  return items.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.qty || 0),
    0
  );
}

function fixImagePath(path) {
  if (!path) return "../images/plant.jpeg";
  const file = String(path).split("/").pop();
  return "../images/" + file;
}

function renderSummary() {
  const items = getCart();
  const list = document.getElementById("summary-list");
  const empty = document.getElementById("summary-empty");
  const totals = document.getElementById("summary-totals");
  const placeBtn = document.getElementById("place-order-btn");

  if (!list || !empty || !totals || !placeBtn) return;

  list.innerHTML = "";

  if (items.length === 0) {
    empty.hidden = false;
    totals.hidden = true;
    placeBtn.disabled = true;
    return;
  }

  empty.hidden = true;
  totals.hidden = false;
  placeBtn.disabled = false;

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "summary-item";
    const lineTotal = Number(item.price || 0) * Number(item.qty || 0);
    li.innerHTML =
      '<img src="' +
      fixImagePath(item.image) +
      '" alt="' +
      item.name +
      '">' +
      '<div class="summary-item-info">' +
      '<span class="summary-item-name">' +
      item.name +
      "</span>" +
      '<span class="summary-item-meta">Qty: ' +
      item.qty +
      " · ₹" +
      item.price +
      " each</span>" +
      "</div>" +
      '<span class="summary-item-price">₹' +
      lineTotal +
      "</span>";
    list.appendChild(li);
  });

  const subtotal = getCartTotal(items);
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  document.getElementById("summary-subtotal").textContent = "₹" + subtotal;
  document.getElementById("summary-delivery").textContent =
    delivery === 0 ? "Free" : "₹" + delivery;
  document.getElementById("summary-total").textContent = "₹" + total;

  const freeShip = document.getElementById("free-ship");
  if (freeShip) freeShip.hidden = delivery !== 0;
}

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();

  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const items = getCart();
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("fullName") || "").trim();
    const payment = String(data.get("payment") || "cod");

    clearCart();

    const wrap = document.getElementById("checkout-form-wrap");
    const success = document.getElementById("checkout-success");
    const message = document.getElementById("success-message");

    if (wrap) wrap.classList.add("hide");
    if (success) success.classList.add("show");
    if (message) {
      const payLabel =
        payment === "cod"
          ? "Cash on Delivery"
          : payment === "upi"
            ? "UPI"
            : "Card";
      message.textContent =
        "Thank you, " +
        name +
        "! Your order is confirmed. Payment method: " +
        payLabel +
        ".";
    }
  });
});
