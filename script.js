function getCart() {
  return JSON.parse(localStorage.getItem("ygf-cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("ygf-cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  const el = document.getElementById("cart-count");
  if (el) el.textContent = total;
}

function updateRosaryColour() {
  const select = document.getElementById("rosary-colour");
  if (!select) return;

  const option = select.options[select.selectedIndex];

  document.getElementById("main-rosary-img").src = option.dataset.main;
  document.getElementById("second-rosary-img").src = option.dataset.second;
}

function addSelectedRosaryToCart() {
  const cart = getCart();

  const select = document.getElementById("rosary-colour");
  const option = select.options[select.selectedIndex];

  const itemName = "YGF ROSARY (" + option.value + ")";
  const itemPrice = 35;

  const existing = cart.find(item => item.name === itemName);

  if (existing) {
    existing.quantity = (Number(existing.quantity) || 1) + 1;
  } else {
    cart.push({
      name: itemName,
      price: itemPrice,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  alert("Added to cart");
}

function loadCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  container.innerHTML = "";

  cart.forEach((item, index) => {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 35;
    const name = item.name || "YGF ROSARY";

    container.innerHTML += `
      <div class="cart-item">
        <div>
          <h3>${name}</h3>
          <p>x${quantity}</p>
          <p>£${price * quantity}</p>
        </div>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  loadCart();
  loadCheckout();
  updateCartCount();
}

function loadCheckout() {
  const container = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");

  if (!container || !totalEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "Your cart is empty.";
    totalEl.textContent = "0";
    return;
  }

  let total = 0;
  container.innerHTML = "";

  cart.forEach(item => {
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 35;
    const name = item.name || "YGF ROSARY";

    total += price * quantity;

    container.innerHTML += `
      <div class="checkout-item">
        <strong>${name}</strong> x${quantity}<br>
        £${price * quantity}
      </div>
    `;
  });

  totalEl.textContent = total;
}

const passwordForm = document.getElementById("password-form");

if (passwordForm) {
  passwordForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const input = document.getElementById("drop-password").value.trim().toUpperCase();

    if (input === "ROSARIES3/3") {
      window.location.href = "rosary.html";
    } else {
      document.getElementById("password-message").textContent = "Wrong password";
    }
  });
}

const countdown = document.querySelector("[data-countdown]");

if (countdown) {
  const dropDate = new Date("2026-05-30T19:00:00+01:00").getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const gap = dropDate - now;

    if (gap <= 0) {
      countdown.textContent = "LIVE";
      return;
    }

    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap / (1000 * 60 * 60)) % 24);
    const m = Math.floor((gap / (1000 * 60)) % 60);
    const s = Math.floor((gap / 1000) % 60);

    countdown.textContent = `${d}D ${h}H ${m}M ${s}S`;
  }, 1000);
}

updateCartCount();
loadCart();
loadCheckout();
