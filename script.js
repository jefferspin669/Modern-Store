let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;
  countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.image}" />
      <h3>${product.title}</h3>
      <div class="price">$${product.price}</div>
      <button>Add to Cart</button>
    `;

    card.querySelector("button").onclick = () => addToCart(product);
    grid.appendChild(card);
  });
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  showToast("Added to cart");
}

function renderCartPage() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven’t added anything yet.</p>
        <a href="index.html" class="primary-btn empty-btn">
          Continue Shopping
        </a>
      </div>
    `;
    totalEl.textContent = "0.00";
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-title">${item.title}</div>

      <div class="quantity-row">
        <div class="quantity-controls">
          <button class="minus">-</button>
          <span>${item.quantity}</span>
          <button class="plus">+</button>
        </div>

        <div class="item-price">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
      </div>

      <button class="remove-btn">Remove</button>
    `;

    div.querySelector(".minus").onclick = () => {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== item.id);
      }
      saveCart();
      renderCartPage();
      updateCartCount();
    };

    div.querySelector(".plus").onclick = () => {
      item.quantity++;
      saveCart();
      renderCartPage();
      updateCartCount();
    };

    div.querySelector(".remove-btn").onclick = () => {
      cart = cart.filter(i => i.id !== item.id);
      saveCart();
      renderCartPage();
      updateCartCount();
    };

    container.appendChild(div);
  });

  totalEl.textContent = total.toFixed(2);
}

function setupCheckout() {
  const btn = document.getElementById("checkoutBtn");
  const overlay = document.getElementById("successOverlay");
  const continueBtn = document.getElementById("continueShopping");

  if (!btn) return;

  btn.onclick = () => {
    if (!cart.length) return;
    overlay.classList.remove("hidden");

    cart = [];
    saveCart();
    renderCartPage();
    updateCartCount();
  };

  if (continueBtn) {
    continueBtn.onclick = () => {
      overlay.classList.add("hidden");
      window.location.href = "index.html";
    };
  }
}

updateCartCount();
fetchProducts();
renderCartPage();
setupCheckout();
