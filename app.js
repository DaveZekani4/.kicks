

// ─── PRODUCT DATA ───────────────────────────
const products = [
  {
    id: 1,
    title: "Air Force",
    price: 119,
    desc: "The classic silhouette reimagined for the new season. Lightweight, durable, and made to turn heads on any street.",
    badge: "BESTSELLER",
    colors: [
      { code: "black",   img: "/air.png"  },
      { code: "darkblue",img: "/air2.png" },
    ],
  },
  {
    id: 2,
    title: "Air Jordan",
    price: 149,
    desc: "Iconic heritage meets modern comfort. The Jordan legacy, reloaded for 2026.",
    badge: "NEW DROP",
    colors: [
      { code: "lightgray", img: "/jordan.png"  },
      { code: "green",     img: "/jordan2.png" },
    ],
  },
  {
    id: 3,
    title: "Blazer",
    price: 109,
    desc: "Court-inspired DNA. Street-ready attitude. The Blazer never goes out of style.",
    badge: "HOT",
    colors: [
      { code: "lightgray", img: "/blazer.png"  },
      { code: "green",     img: "/blazer2.png" },
    ],
  },
  {
    id: 4,
    title: "Crater",
    price: 129,
    desc: "Built from recycled materials. Light as air, hard as stone. The future of sustainable kicks.",
    badge: "ECO",
    colors: [
      { code: "black",     img: "/crater.png"  },
      { code: "lightgray", img: "/crater2.png" },
    ],
  },
  {
    id: 5,
    title: "Hippie",
    price: 99,
    desc: "Free spirit, full comfort. The Hippie brings laid-back California vibes to every step.",
    badge: "LIMITED",
    colors: [
      { code: "gray",  img: "/hippie.png"  },
      { code: "black", img: "/hippie2.png" },
    ],
  },
];

// ─── STATE ──────────────────────────────────
let cart = [];
let choosenProduct = products[0];
let selectedColorIndex = 0;
let selectedSize = null;
let currentStep = 1;

// ─── DOM REFS ───────────────────────────────
const wrapper          = document.querySelector(".sliderWrapper");
const menuItems        = document.querySelectorAll(".menuItem");
const currentProductImg    = document.querySelector(".productImg");
const currentProductTitle  = document.querySelector(".productTitle");
const currentProductPrice  = document.querySelector(".productPrice");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes  = document.querySelectorAll(".size");

const cartTrigger    = document.getElementById("cartTrigger");
const cartOverlay    = document.getElementById("cartOverlay");
const cartDrawer     = document.getElementById("cartDrawer");
const cartCloseBtn   = document.getElementById("cartCloseBtn");
const cartBadge      = document.getElementById("cartBadge");
const cartItemsEl    = document.getElementById("cartItems");
const cartEmpty      = document.getElementById("cartEmpty");
const cartFooter     = document.getElementById("cartFooter");
const cartTotal      = document.getElementById("cartTotal");

const openCheckoutBtn  = document.getElementById("openCheckoutBtn");
const checkoutOverlay  = document.getElementById("checkoutOverlay");
const checkoutClose    = document.getElementById("checkoutClose");
const checkoutSummary  = document.getElementById("checkoutSummary");
const checkoutTotalDisplay = document.getElementById("checkoutTotalDisplay");

const contactTrigger   = document.getElementById("contactTrigger");
const contactOverlay   = document.getElementById("contactOverlay");
const contactClose     = document.getElementById("contactClose");
const footerContact    = document.getElementById("footerContact");

const addToCartBtn     = document.getElementById("addToCartBtn");
const continueShopping = document.getElementById("continueShopping");

// ─── SLIDER + MENU ──────────────────────────
menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Slide
    wrapper.style.transform = `translateX(${-100 * index}vw)`;

    // Active state
    menuItems.forEach(m => m.classList.remove("active"));
    item.classList.add("active");

    // Update chosen product
    choosenProduct  = products[index];
    selectedColorIndex = 0;
    selectedSize    = null;

    // Update hero product section
    currentProductTitle.textContent = choosenProduct.title.toUpperCase();
    currentProductPrice.textContent = "$" + choosenProduct.price;
    currentProductImg.src = choosenProduct.colors[0].img;

    currentProductColors.forEach((color, i) => {
      color.style.backgroundColor = choosenProduct.colors[i]?.code || "transparent";
      color.classList.remove("selected");
    });
    currentProductColors[0]?.classList.add("selected");

    currentProductSizes.forEach(s => s.classList.remove("active"));

    // Reset add to cart button
    addToCartBtn.textContent = "ADD TO CART +";
  });
});

// Activate first menu item on load
menuItems[0]?.classList.add("active");
currentProductColors[0]?.classList.add("selected");

// ─── COLOR SWITCHER ─────────────────────────
currentProductColors.forEach((color, index) => {
  color.addEventListener("click", () => {
    currentProductImg.src = choosenProduct.colors[index].img;
    selectedColorIndex = index;
    currentProductColors.forEach(c => c.classList.remove("selected"));
    color.classList.add("selected");
  });
});

// ─── SIZE SELECTOR ──────────────────────────
currentProductSizes.forEach((size) => {
  size.addEventListener("click", () => {
    currentProductSizes.forEach(s => s.classList.remove("active"));
    size.classList.add("active");
    selectedSize = size.textContent;
  });
});

// ─── ADD TO CART (Hero) ─────────────────────
addToCartBtn.addEventListener("click", () => {
  if (!selectedSize) {
    showToast("Select a size to continue");
    // Shake sizes
    document.querySelector(".sizes").style.animation = "none";
    setTimeout(() => {
      document.querySelector(".sizes").animate([
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0)" },
      ], { duration: 300 });
    }, 10);
    return;
  }

  addToCart(choosenProduct, selectedSize, selectedColorIndex);
  addToCartBtn.textContent = "✓ ADDED TO CART";
  setTimeout(() => { addToCartBtn.textContent = "ADD TO CART +"; }, 2000);
});

// ─── PRODUCT GRID ───────────────────────────
function renderProductGrid() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card-img-wrap">
        <img src="${product.colors[0].img}" alt="${product.title}" class="product-card-img" loading="lazy">
        <div class="product-card-badge">${product.badge}</div>
      </div>
      <div class="product-card-body">
        <h3 class="product-card-title">${product.title.toUpperCase()}</h3>
        <div class="product-card-price">$${product.price}</div>
        <div class="product-card-colors">
          ${product.colors.map(c => `<div class="product-card-color" style="background:${c.code}" title="${c.code}"></div>`).join("")}
        </div>
        <button class="product-card-btn" onclick="quickAddToCart(${product.id})">
          QUICK ADD +
        </button>
      </div>
    </div>
  `).join("");
}

function quickAddToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  // Quick add picks a default size
  addToCart(product, "42", 0);
}

renderProductGrid();

// ─── CART LOGIC ─────────────────────────────
function addToCart(product, size, colorIndex) {
  const colorCode = product.colors[colorIndex]?.code || product.colors[0].code;
  const existingIndex = cart.findIndex(
    item => item.id === product.id && item.size === size && item.color === colorCode
  );

  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id:       product.id,
      title:    product.title,
      price:    product.price,
      size:     size,
      color:    colorCode,
      img:      product.colors[colorIndex]?.img || product.colors[0].img,
      qty:      1,
    });
  }

  updateCartUI();
  openCart();
  showToast(`Added: ${product.title}`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    removeFromCart(index);
    return;
  }
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  // Badge
  cartBadge.textContent = count;
  cartBadge.style.background = count > 0 ? "#369e62" : "white";
  cartBadge.style.color       = count > 0 ? "white"   : "black";

  // Empty state
  if (cart.length === 0) {
    cartEmpty.style.display  = "flex";
    cartFooter.style.display = "none";
    cartItemsEl.innerHTML    = "";
    cartItemsEl.appendChild(cartEmpty);
    return;
  }

  cartEmpty.style.display  = "none";
  cartFooter.style.display = "flex";
  cartTotal.textContent    = "$" + total;

  // Render items
  cartItemsEl.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title.toUpperCase()}</h4>
        <div class="cart-item-meta">Size ${item.size} · ${item.color}</div>
        <div class="cart-item-price">$${(item.price * item.qty)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
          <div class="qty-value">${item.qty}</div>
          <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
          <button class="cart-remove" onclick="removeFromCart(${i})" title="Remove">×</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ─── CART OPEN / CLOSE ───────────────────────
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartTrigger.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
continueShopping.addEventListener("click", closeCart);

// ─── CHECKOUT FLOW ──────────────────────────
function openCheckout() {
  if (cart.length === 0) { showToast("Your cart is empty"); return; }

  // Build summary
  checkoutSummary.innerHTML = cart.map(item => `
    <div class="checkout-summary-item">
      <span>${item.title} <span style="color:#888; font-size:12px;">×${item.qty} · Sz${item.size}</span></span>
      <strong>$${item.price * item.qty}</strong>
    </div>
  `).join("");
  checkoutTotalDisplay.textContent = "$" + getCartTotal();

  // Reset to step 1
  goToStep(1);

  checkoutOverlay.classList.add("open");
  closeCart();
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  checkoutOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

openCheckoutBtn.addEventListener("click", openCheckout);
checkoutClose.addEventListener("click", closeCheckout);
checkoutOverlay.addEventListener("click", (e) => {
  if (e.target === checkoutOverlay) closeCheckout();
});

window.goToStep = function(stepNum) {
  currentStep = stepNum;
  document.querySelectorAll(".checkout-step-content").forEach(el => el.classList.add("hidden"));
  const target = document.getElementById("step" + stepNum);
  if (target) target.classList.remove("hidden");

  // Update step indicators
  document.querySelectorAll(".step").forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.remove("active", "completed");
    if (n === stepNum) s.classList.add("active");
    if (n < stepNum) s.classList.add("completed");
  });
};

window.processPayment = function() {
  // Basic validation
  const cardEl = document.getElementById("co-card");
  if (cardEl && cardEl.value.replace(/\s/g,'').length < 12) {
    showToast("Please enter a valid card number.");
    return;
  }

  // Show success
  document.querySelectorAll(".checkout-step-content").forEach(el => el.classList.add("hidden"));
  document.getElementById("stepSuccess").classList.remove("hidden");

  // Update step UI
  document.querySelectorAll(".step").forEach(s => s.classList.add("completed"));

  // Clear cart
  cart = [];
  updateCartUI();
};

window.closeCheckoutSuccess = function() {
  closeCheckout();
  goToStep(1);
};

// ─── CONTACT MODAL ──────────────────────────
function openContact() {
  contactOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeContact() {
  contactOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

contactTrigger.addEventListener("click", openContact);
contactClose.addEventListener("click", closeContact);
if (footerContact) footerContact.addEventListener("click", openContact);

contactOverlay.addEventListener("click", (e) => {
  if (e.target === contactOverlay) closeContact();
});

// Contact form submit
const contactSubmitBtn = document.querySelector(".btn-contact-submit");
if (contactSubmitBtn) {
  contactSubmitBtn.addEventListener("click", () => {
    showToast("Message sent — we'll be in touch soon.");
    closeContact();
  });
}

// ─── TOAST ──────────────────────────────────
let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ─── SEARCH (basic filter) ──────────────────
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".product-card");
    cards.forEach(card => {
      const title = card.querySelector(".product-card-title")?.textContent.toLowerCase() || "";
      card.style.display = title.includes(query) || query === "" ? "" : "none";
    });
  });
}

// ─── CARD NUMBER FORMATTING ─────────────────
const cardInput = document.getElementById("co-card");
if (cardInput) {
  cardInput.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    e.target.value = val.replace(/(.{4})/g, "$1 ").trim();
  });
}

// ─── WISHLIST (UX only) ──────────────────────
const wishlistBtn = document.querySelector(".wishlistBtn");
if (wishlistBtn) {
  let wishlisted = false;
  const heartOutline = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  const heartFilled = `<svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

  wishlistBtn.addEventListener("click", () => {
    wishlisted = !wishlisted;
    wishlistBtn.innerHTML = wishlisted
      ? `${heartFilled} WISHLISTED`
      : `${heartOutline} WISHLIST`;
    showToast(wishlisted ? "Added to wishlist" : "Removed from wishlist");
  });
}

// ─── INITIALISE ─────────────────────────────
updateCartUI();
