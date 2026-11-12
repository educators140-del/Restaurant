// ============================================================
// Kolachi Restaurant – Robust Supabase & Cart System
// Project: wzrgdrqiaijtiucvpotc
// Works online, offline, via file:// or http://
// ============================================================

const SUPABASE_URL = 'https://wzrgdrqiaijtiucvpotc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8oMZV4dwLjqwtMOQaxbQgw_f7-LY2WS';
const CART_STORAGE_KEY = 'kolachi_cart';

// --- Direct REST API Helper (Always works without external dependencies) ---
async function supabaseRest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Database error (${response.status}): ${errorText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// --- Cart Operations ---
function getCart() {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {}
  updateCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
  showToast(`Added "${item.name}" to cart!`);
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = count;
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #c99738;
      color: #0b0f19;
      padding: 12px 22px;
      border-radius: 8px;
      font-weight: 700;
      z-index: 99999;
      box-shadow: 0 6px 20px rgba(0,0,0,0.6);
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

// Make functions accessible globally on window
window.Kolachi = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabaseRest,
  getCart,
  saveCart,
  addToCart,
  updateCartBadge,
  showToast
};
