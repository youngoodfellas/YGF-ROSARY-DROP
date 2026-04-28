// ==========================
// PASSWORD (INDEX PAGE)
// ==========================
const form = document.getElementById("password-form");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const password = document.getElementById("drop-password").value;
    const message = document.getElementById("password-message");

    if (password === "ROSARIES3/3") {
      window.location.href = "rosary.html";
    } else {
      message.textContent = "Incorrect password";
    }
  });
}


// ==========================
// COUNTDOWN
// ==========================
const countdownEl = document.querySelector("[data-countdown]");

if (countdownEl) {
  const target = new Date("May 30, 2026 19:00:00").getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      countdownEl.textContent = "LIVE";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `${d}D ${h}H ${m}M ${s}S`;
  }, 1000);
}


// ==========================
// CART COUNT
// ==========================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("ygf-cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

updateCartCount();


// ==========================
// CHANGE ROSARY IMAGES
// ==========================
function updateRosaryColour() {
  const select = document.getElementById("rosary-colour");
  const option = select.options[select.selectedIndex];

  const main = option.getAttribute("data-main");
  const second = option.getAttribute("data-second");

  document.getElementById("main-rosary-img").src = main;
  document.getElementById("second-rosary-img").src = second;
}


// ==========================
// ADD TO CART (FIXED)
// ==========================
function addSelectedRosaryToCart() {
  const cart = JSON.parse(localStorage.getItem("ygf-cart")) || [];

  const select = document.getElementById("rosary-colour");
  const option = select.options[select.selectedIndex];

  const name = "YGF ROSARY (" + option.value + ")";
  const price = 45;

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  localStorage.setItem("ygf-cart", JSON.stringify(cart));
  updateCartCount();

  alert("Added to cart");
}


// ==========================
// CART PAGE
// ==========================
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("ygf-cart")) || [];
  const container = document.getElementById("cart-items");

  if (!container) return;

  container.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <p>${item.name}</p>
      <p>x${item.quantity}</p>
      <p>£${item.price * item.quantity}</p>
      <button onclick="removeItem(${index})">Remove</button>
    `;

    container.appendChild(div);
  });
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem("ygf-cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("ygf-cart", JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

loadCart();


// ==========================
// CHECKOUT PAGE
// ==========================
function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem("ygf-cart")) || [];
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");

  if (!container || !totalEl) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "checkout-item";

    div.innerHTML = `<strong>${item.name}</strong> x${item.quantity}`;
    container.appendChild(div);

    total += item.price * item.quantity;
  });

  totalEl.textContent = total;
}

loadCheckout();