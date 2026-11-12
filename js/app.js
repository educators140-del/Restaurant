// ============================================================
// Kolachi Restaurant – Main App Controller (app.js)
// Guaranteed cross-origin and local file:// safe
// ============================================================

(function () {
  const K = window.Kolachi;

  // Authentic Karachi Menu fallback items
  const MENU_DATA = [
    {
      id: 'f1',
      name: 'Dynamite Prawns',
      category: 'seafood',
      description: 'Crispy golden fried Arabian sea king prawns tossed in Kolachi secret spicy tangy dynamite glaze.',
      price: 2350,
      image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=700',
      badge: 'Popular',
      rating: 4.9
    },
    {
      id: 'f2',
      name: 'Kolachi Grilled Fish',
      category: 'seafood',
      description: 'Fresh catch of Karachi sea grilled to perfection with lemon butter garlic herb emulsion.',
      price: 2790,
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700',
      badge: 'Ocean Fresh',
      rating: 4.8
    },
    {
      id: 'f3',
      name: 'Tandoori Jumbo Prawns',
      category: 'seafood',
      description: 'Giant tiger prawns charred on skewers in secret tandoori marinade.',
      price: 3450,
      image_url: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=700',
      badge: 'Luxury',
      rating: 4.9
    },
    {
      id: 'f4',
      name: 'Hunzai Mutton Kebab',
      category: 'bbq-kebabs',
      description: 'Signature tender minced mutton kebabs prepared in indigenous Hunza mountain herbs & melted butter.',
      price: 2490,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700',
      badge: 'Popular',
      rating: 4.9
    },
    {
      id: 'f5',
      name: 'Kolachi Sajji Platter',
      category: 'bbq-kebabs',
      description: 'Charcoal roasted Balochi spiced whole chicken served over fragrant steam rice with spicy tomato gravy.',
      price: 2850,
      image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700',
      badge: 'Bestseller',
      rating: 4.8
    },
    {
      id: 'f6',
      name: 'Chicken Malai Boti',
      category: 'bbq-kebabs',
      description: 'Melt-in-mouth boneless chicken cubes marinated in fresh clotted cream, green chillies & mild spices.',
      price: 1650,
      image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700',
      badge: 'Must Try',
      rating: 4.8
    },
    {
      id: 'f7',
      name: 'Mutton Seekh Kebab',
      category: 'bbq-kebabs',
      description: 'Prime lean minced mutton laced with onion, ginger, garlic and skewered over fiery charcoal.',
      price: 2150,
      image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700',
      badge: 'Signature',
      rating: 4.7
    },
    {
      id: 'f8',
      name: 'Peshawari Mutton Karahi',
      category: 'karahi-handi',
      description: 'Tender fresh mutton simmered in ripe tomatoes, green chillies & crushed black pepper (1/2 kg).',
      price: 2950,
      image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700',
      badge: 'Top Rated',
      rating: 4.9
    },
    {
      id: 'f9',
      name: 'Kolachi Special White Karahi',
      category: 'karahi-handi',
      description: 'Velvety chicken karahi with green cardamom, yogurt, white pepper and rich fresh cream.',
      price: 2390,
      image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700',
      badge: 'Special',
      rating: 4.8
    },
    {
      id: 'f10',
      name: 'Chicken Handi Makhni',
      category: 'karahi-handi',
      description: 'Boneless chicken cubes slow-cooked in rich velvety butter and fenugreek gravy.',
      price: 2190,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700',
      badge: 'Smooth',
      rating: 4.7
    },
    {
      id: 'f11',
      name: 'Kolachi Deck Tenderloin Steak',
      category: 'steaks',
      description: 'Prime aged beef undercut with wild mushroom sauce, creamy mashed potatoes & sauteed vegetables.',
      price: 3350,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700',
      badge: 'Premium',
      rating: 4.8
    },
    {
      id: 'f12',
      name: 'Tarragon Chicken Steak',
      category: 'steaks',
      description: 'Twin grilled chicken breasts blanketed under creamy herb tarragon reduction with crispy fries.',
      price: 2250,
      image_url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=700',
      badge: 'Classic',
      rating: 4.6
    },
    {
      id: 'f13',
      name: 'Dum Pukht Mutton Biryani',
      category: 'breads-rice',
      description: 'Aromatic long-grain basmati layered with succulent spiced mutton and saffron steam.',
      price: 1890,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700',
      badge: 'Aromatic',
      rating: 4.8
    },
    {
      id: 'f14',
      name: 'Garlic Cheese Naan',
      category: 'breads-rice',
      description: 'Oven-fresh tandoori naan stuffed with melting mozzarella & cheddar, glazed with garlic cilantro butter.',
      price: 450,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700',
      badge: 'Freshly Baked',
      rating: 4.9
    },
    {
      id: 'f15',
      name: 'Roghni Naan',
      category: 'breads-rice',
      description: 'Traditional sesame-sprinkled fluffy tandoori flatbread brushed with pure desi ghee.',
      price: 220,
      image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700',
      badge: 'Tandoori',
      rating: 4.7
    },
    {
      id: 'f16',
      name: 'Kolachi Sea Breeze Mint Lemonade',
      category: 'desserts-drinks',
      description: 'Crushed garden mint leaves, fresh lime juice, sparkling soda and pink rock salt.',
      price: 490,
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700',
      badge: 'Chilled',
      rating: 4.9
    },
    {
      id: 'f17',
      name: 'Shahi Kulfi Falooda',
      category: 'desserts-drinks',
      description: 'Traditional rich malai kulfi served with rose syrup, basil seeds, rabri and vermicelli.',
      price: 750,
      image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700',
      badge: 'Sweet Delight',
      rating: 4.9
    }
  ];

  window.Kolachi.MENU_DATA = MENU_DATA;

  document.addEventListener('DOMContentLoaded', async () => {
    K.updateCartBadge();
    initCartDrawer();
    checkAuthSession();
    await loadLiveMenuFromSupabase();
  });

  // Fetch live menu items directly from Supabase database
  async function loadLiveMenuFromSupabase() {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    try {
      const items = await K.supabaseRest('menu_items?select=*,categories(name,slug)&order=created_at.desc');
      if (items && items.length > 0) {
        window.Kolachi.LIVE_MENU = items;
        renderMenuItems(items, grid);
      } else {
        renderMenuItems(MENU_DATA, grid);
      }
    } catch (err) {
      console.warn('Could not load live menu from Supabase, using static fallback:', err);
      renderMenuItems(MENU_DATA, grid);
    }

    initMenuInteractions();
  }

  function renderMenuItems(items, container) {
    container.innerHTML = items.map(item => {
      const catSlug = (item.categories && item.categories.slug) ? item.categories.slug : (item.category || 'all');
      const img = item.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700';
      const badgeHtml = item.badge ? `<span class="food-badge">${item.badge}</span>` : '';
      const rating = item.rating || 4.8;
      const desc = item.description || 'Delicious Kolachi chef preparation fresh from the kitchen.';
      const price = Number(item.price) || 0;

      return `
        <div class="food-card" data-category="${catSlug}">
          <div class="food-card-img-wrap">
            <img src="${img}" alt="${item.name}" loading="lazy">
            ${badgeHtml}
            <span class="food-rating"><i class="fa-solid fa-star"></i> ${rating}</span>
          </div>
          <div class="food-card-body">
            <h3 class="food-title">${item.name}</h3>
            <p class="food-desc">${desc}</p>
            <div class="food-footer">
              <div class="food-price">
                <span class="curr">Price</span>
                <span class="val">Rs ${price.toLocaleString()}</span>
              </div>
              <div class="food-action-btns">
                <button class="add-cart-btn" data-id="${item.id}" data-name="${encodeURIComponent(item.name)}" data-price="${price}">
                  <i class="fa-solid fa-cart-plus"></i> Add
                </button>
                <a href="portal.html?orderItem=${encodeURIComponent(item.id)}" class="order-now-link" data-id="${item.id}" data-name="${encodeURIComponent(item.name)}" data-price="${price}">
                  <i class="fa-solid fa-bolt"></i> Order Food
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Attach click handlers to any Add / Order buttons
  function initMenuInteractions() {
    // Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const name = decodeURIComponent(btn.getAttribute('data-name'));
        const price = parseFloat(btn.getAttribute('data-price'));
        K.addToCart({ id, name, price });
      });
    });

    // "Order Food" links
    document.querySelectorAll('.order-now-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('data-id');
        const name = decodeURIComponent(link.getAttribute('data-name'));
        const price = parseFloat(link.getAttribute('data-price'));
        K.addToCart({ id, name, price });
      });
    });

    // Menu category filters
    const tabs = document.querySelectorAll('.cat-tab-btn');
    const cards = document.querySelectorAll('.food-card');
    const searchInput = document.getElementById('menu-search');

    function filterCards() {
      const activeTab = document.querySelector('.cat-tab-btn.active');
      const cat = activeTab ? activeTab.getAttribute('data-cat') : 'all';
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      cards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        const title = (card.querySelector('.food-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.food-desc')?.textContent || '').toLowerCase();

        const matchesCat = (cat === 'all' || itemCat === cat);
        const matchesQuery = (query === '' || title.includes(query) || desc.includes(query));

        card.style.display = (matchesCat && matchesQuery) ? 'flex' : 'none';
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', filterCards);
    }
  }

  // Cart drawer rendering & controls
  function initCartDrawer() {
    const openBtn = document.getElementById('open-cart-btn');
    const closeBtn = document.getElementById('close-cart-btn');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const cartList = document.getElementById('cart-items-list');
    const cartTotalVal = document.getElementById('cart-total-value');
    const checkoutBtn = document.getElementById('checkout-btn');

    function renderCartDrawer() {
      const cart = K.getCart();
      if (!cartList) return;

      if (cart.length === 0) {
        cartList.innerHTML = `
          <div class="empty-cart-msg">
            <i class="fa-solid fa-basket-shopping"></i>
            <p>Your cart is empty.</p>
            <span style="font-size:0.8rem; color:var(--text-muted)">Add savory BBQ, Karahi, or Seafood to start your order.</span>
          </div>
        `;
        if (cartTotalVal) cartTotalVal.textContent = 'Rs 0';
        return;
      }

      cartList.innerHTML = cart.map(item => `
        <div class="cart-item-row">
          <div class="item-info">
            <h4>${item.name}</h4>
            <span class="item-unit-price">Rs ${item.price.toLocaleString()} × ${item.quantity}</span>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${item.id}" data-action="dec">-</button>
            <span style="font-weight:700;">${item.quantity}</span>
            <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
          </div>
        </div>
      `).join('');

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (cartTotalVal) {
        cartTotalVal.textContent = `Rs ${total.toLocaleString()}`;
      }

      cartList.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const action = btn.getAttribute('data-action');
          let currentCart = K.getCart();
          const found = currentCart.find(i => i.id === id);
          if (found) {
            found.quantity += (action === 'inc' ? 1 : -1);
            if (found.quantity <= 0) {
              currentCart = currentCart.filter(i => i.id !== id);
            }
          }
          K.saveCart(currentCart);
          renderCartDrawer();
        });
      });
    }

    function toggleDrawer(open) {
      if (open) {
        renderCartDrawer();
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

  // Check auth
  function checkAuthSession() {
    try {
      const stored = localStorage.getItem('sb-' + K.SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token');
      if (stored) {
        const session = JSON.parse(stored);
        if (session && session.user) {
          const authContainer = document.getElementById('nav-auth-container');
          if (authContainer) {
            authContainer.innerHTML = `
              <a href="portal.html" class="btn btn-primary" style="padding: 8px 14px; font-size: 0.85rem;">
                <i class="fa-solid fa-user-circle"></i> Portal
              </a>
            `;
          }
        }
      }
    } catch (e) {}
  }
})();
