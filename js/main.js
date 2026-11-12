import { fetchMenuItems, renderMenu } from './menu.js';
import { getCart, removeFromCart, updateQuantity, getCartTotal, updateCartBadge } from './cart.js';
import { getCurrentUser, signOut } from './auth.js';

let allMenuItems = [];

document.addEventListener('DOMContentLoaded', async () => {
  updateCartBadge();
  initAuthUI();
  initCartDrawer();
  await loadMenu();
  setupFilterAndSearch();
});

async function initAuthUI() {
  const user = await getCurrentUser();
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) return;

  if (user) {
    authContainer.innerHTML = `
      <a href="portal.html" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.85rem;">
        <i class="fa-solid fa-user-circle"></i> Portal
      </a>
      <button id="logout-btn" class="btn btn-outline" style="padding: 8px 12px; font-size: 0.85rem;">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    `;
    document.getElementById('logout-btn')?.addEventListener('click', () => signOut());
  } else {
    authContainer.innerHTML = `
      <a href="login.html" class="btn btn-outline" style="padding: 8px 16px; font-size: 0.85rem;">Sign In</a>
      <a href="portal.html" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">Place Order</a>
    `;
  }
}

async function loadMenu() {
  const grid = document.getElementById('menu-grid');
  allMenuItems = await fetchMenuItems();
  renderMenu(allMenuItems, grid);
}

function setupFilterAndSearch() {
  const grid = document.getElementById('menu-grid');
  const searchInput = document.getElementById('menu-search');
  const tabs = document.querySelectorAll('.cat-tab-btn');

  let currentCategory = 'all';
  let searchTerm = '';

  function applyFilter() {
    let filtered = allMenuItems;
    if (currentCategory !== 'all') {
      filtered = filtered.filter(item => item.category_slug === currentCategory);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    }
    renderMenu(filtered, grid);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-cat');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      applyFilter();
    });
  }
}

function initCartDrawer() {
  const openBtn = document.getElementById('open-cart-btn');
  const closeBtn = document.getElementById('close-cart-btn');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const cartList = document.getElementById('cart-items-list');
  const cartTotalVal = document.getElementById('cart-total-value');
  const checkoutBtn = document.getElementById('checkout-btn');

  function renderDrawer() {
    const cart = getCart();
    if (!cartList) return;

    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="empty-cart-msg">
          <i class="fa-solid fa-basket-shopping"></i>
          <p>Your cart is empty.</p>
          <span style="font-size:0.8rem; color:var(--text-muted)">Add savory BBQ, Karahi, or seafood to start your order.</span>
        </div>
      `;
      if (cartTotalVal) cartTotalVal.textContent = 'Rs 0';
      return;
    }

    cartList.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="item-info">
          <h4>${item.name}</h4>
          <span class="item-unit-price">Rs ${item.price.toLocaleString()}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
    `).join('');

    if (cartTotalVal) {
      cartTotalVal.textContent = `Rs ${getCartTotal().toLocaleString()}`;
    }

    cartList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        updateQuantity(id, action === 'inc' ? 1 : -1);
        renderDrawer();
      });
    });
  }

  function toggleDrawer(open) {
    if (open) {
      renderDrawer();
      drawer?.classList.add('active');
      overlay?.classList.add('active');
    } else {
      drawer?.classList.remove('active');
      overlay?.classList.remove('active');
    }
  }

  openBtn?.addEventListener('click', () => toggleDrawer(true));
  closeBtn?.addEventListener('click', () => toggleDrawer(false));
  overlay?.addEventListener('click', () => toggleDrawer(false));

  checkoutBtn?.addEventListener('click', () => {
    window.location.href = 'portal.html';
  });
}
