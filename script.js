const DROP_PASSWORD = "YGF0244";
const DROP_DATE = "2026-05-30T19:00:00+01:00";

const ROSARY_STOCK = {
  Silver: 10,
  Black: 10,
  Gold: 10
};

let selectedRosaryColour = "Silver";
let selectedRosaryImage = "rosary1.png";

function getCart() {
  return JSON.parse(localStorage.getItem("ygf-cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("ygf-cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = document.getElementById("cart-count");
  if (count) count.textContent = getCart().length;
}

function getRosaryColourCount(colour) {
  return getCart().filter(item => item.name === "YGF ROSARY" && item.colour === colour).length;
}

function updateRosaryColour() {
  const select = document.getElementById("rosary-colour");
  if (!select) return;

  selectedRosaryColour = select.value;
  selectedRosaryImage = select.options[select.selectedIndex].dataset.main;

  const mainImage = document.getElementById("main-rosary-img");
  const secondImage = document.getElementById("second-rosary-img");

  if (mainImage) mainImage.src = selectedRosaryImage;
  if (secondImage) secondImage.src = select.options[select.selectedIndex].dataset.second;
}

function addSelectedRosaryToCart() {
  if (getRosaryColourCount(selectedRosaryColour) >= ROSARY_STOCK[selectedRosaryColour]) {
    alert(selectedRosaryColour + " is sold out.");
    return;
  }

  addToCart("YGF ROSARY", 45, selectedRosaryImage, "One Size", selectedRosaryColour);
}

function addToCart(name, price, image, size, colour) {
  const cart = getCart();

  cart.push({
    name: name,
    price: price,
    image: image,
    size: size,
    colour: colour
  });

  saveCart(cart);
  updateCartCount();

  alert(name + " added to cart");
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCart();
  displayCheckout();
  updateCartCount();
}

function displayCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  container.innerHTML = "";

  cart.forEach((item, index) => {
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>Colour: ${item.colour}</p>
          <p>Size: ${item.size}</p>
          <p>£${item.price}</p>
        </div>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });
}

function displayCheckout() {
  const itemsBox = document.getElementById("checkout-items");
  const totalBox = document.getElementById("checkout-total");

  if (!itemsBox || !totalBox) return;

  const cart = getCart();

  if (cart.length === 0) {
    itemsBox.innerHTML = "Your cart is empty.";
    totalBox.textContent = "0";
    return;
  }

  let total = 0;
  itemsBox.innerHTML = "";

  cart.forEach(item => {
    total += Number(item.price);

    itemsBox.innerHTML += `
      <div class="checkout-item">
        <strong>${item.name}</strong><br>
        Colour: ${item.colour}<br>
        Size: ${item.size}<br>
        £${item.price}
      </div>
    `;
  });

  totalBox.textContent = total;
}

function runCountdown() {
  const countdowns = document.querySelectorAll("[data-countdown]");
  if (!countdowns.length) return;

  function update() {
    const now = new Date().getTime();
    const dropTime = new Date(DROP_DATE).getTime();
    const distance = dropTime - now;

    if (distance <= 0) {
      countdowns.forEach(box => box.innerHTML = "STORE OPEN");
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdowns.forEach(box => {
      box.innerHTML = `${days}D ${hours}H ${minutes}M ${seconds}S`;
    });
  }

  update();
  setInterval(update, 1000);
}

const passwordForm = document.getElementById("password-form");

if (passwordForm) {
  passwordForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const input = document.getElementById("drop-password").value.trim().toUpperCase();
    const message = document.getElementById("password-message");

    if (input === DROP_PASSWORD) {
      sessionStorage.setItem("ygf-unlocked", "true");
      window.location.href = "rosary.html";
    } else {
      message.textContent = "Wrong password.";
    }
  });
}

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    window.location.href = "success.html";
  });
}

displayCart();
displayCheckout();
updateCartCount();
runCountdown();