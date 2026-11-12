import { supabase } from './supabaseClient.js';
import { addToCart } from './cart.js';

// Fallback items if Supabase tables haven't been seeded yet
export const FALLBACK_MENU = [
  // Seafood
  {
    id: 'f1',
    name: 'Dynamite Prawns',
    category: 'Seafood Special',
    category_slug: 'seafood',
    description: 'Crispy golden fried Arabian sea king prawns tossed in Kolachi secret spicy tangy dynamite glaze',
    price: 2350,
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=700',
    badge: 'Popular',
    rating: 4.9
  },
  {
    id: 'f2',
    name: 'Kolachi Grilled Fish',
    category: 'Seafood Special',
    category_slug: 'seafood',
    description: 'Fresh catch of Karachi sea grilled to perfection with lemon butter garlic herb emulsion',
    price: 2790,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=700',
    badge: 'Ocean Fresh',
    rating: 4.8
  },
  {
    id: 'f3',
    name: 'Tandoori Jumbo Prawns',
    category: 'Seafood Special',
    category_slug: 'seafood',
    description: 'Giant tiger prawns marinated in tandoori spices and charred on skewers',
    price: 3450,
    image_url: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=700',
    badge: 'Luxury',
    rating: 4.9
  },
  // BBQ & Kebabs
  {
    id: 'f4',
    name: 'Hunzai Mutton Kebab',
    category: 'BBQ & Kebabs',
    category_slug: 'bbq-kebabs',
    description: 'Signature tender minced mutton kebabs prepared in indigenous Hunza mountain herbs & melted butter',
    price: 2490,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700',
    badge: 'Popular',
    rating: 4.9
  },
  {
    id: 'f5',
    name: 'Kolachi Sajji Platter',
    category: 'BBQ & Kebabs',
    category_slug: 'bbq-kebabs',
    description: 'Charcoal roasted Balochi spiced whole chicken served over fragrant steam rice',
    price: 2850,
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=700',
    badge: 'Bestseller',
    rating: 4.8
  },
  {
    id: 'f6',
    name: 'Chicken Malai Boti',
    category: 'BBQ & Kebabs',
    category_slug: 'bbq-kebabs',
    description: 'Melt-in-mouth boneless chicken cubes marinated in fresh clotted cream and mild herbs',
    price: 1650,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700',
    badge: 'Must Try',
    rating: 4.8
  },
  {
    id: 'f7',
    name: 'Mutton Seekh Kebab',
    category: 'BBQ & Kebabs',
    category_slug: 'bbq-kebabs',
    description: 'Prime lean minced mutton laced with onion, ginger, garlic and skewered over fiery charcoal',
    price: 2150,
    image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=700',
    badge: 'Signature',
    rating: 4.7
  },
  // Karahi & Handi
  {
    id: 'f8',
    name: 'Peshawari Mutton Karahi',
    category: 'Karahi & Handi',
    category_slug: 'karahi-handi',
    description: 'Tender fresh mutton simmered in ripe tomatoes, green chillies & crushed black pepper (1/2 kg)',
    price: 2950,
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700',
    badge: 'Top Rated',
    rating: 4.9
  },
  {
    id: 'f9',
    name: 'Kolachi Special White Karahi',
    category: 'Karahi & Handi',
    category_slug: 'karahi-handi',
    description: 'Velvety chicken karahi with green cardamom, yogurt, white pepper and rich fresh cream',
    price: 2390,
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700',
    badge: 'Special',
    rating: 4.8
  },
  {
    id: 'f10',
    name: 'Chicken Handi Makhni',
    category: 'Karahi & Handi',
    category_slug: 'karahi-handi',
    description: 'Boneless chicken cubes slow-cooked in rich velvety butter and fenugreek gravy',
    price: 2190,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=700',
    badge: 'Smooth',
    rating: 4.7
  },
  // Steaks & Continental
  {
    id: 'f11',
    name: 'Kolachi Deck Tenderloin Steak',
    category: 'Steaks & Continental',
    category_slug: 'steaks',
    description: 'Prime aged beef undercut with wild mushroom sauce, creamy mashed potatoes & sauteed vegetables',
    price: 3350,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700',
    badge: 'Premium',
    rating: 4.8
  },
  {
    id: 'f12',
    name: 'Tarragon Chicken Steak',
    category: 'Steaks & Continental',
    category_slug: 'steaks',
    description: 'Twin grilled chicken breasts blanketed under creamy herb tarragon reduction with crispy fries',
    price: 2250,
    image_url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=700',
    badge: 'Classic',
    rating: 4.6
  },
  // Breads & Rice
  {
    id: 'f13',
    name: 'Dum Pukht Mutton Biryani',
    category: 'Breads & Rice',
    category_slug: 'breads-rice',
    description: 'Aromatic long-grain basmati layered with succulent spiced mutton and saffron steam',
    price: 1890,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700',
    badge: 'Aromatic',
    rating: 4.8
  },
  {
    id: 'f14',
    name: 'Garlic Cheese Naan',
    category: 'Breads & Rice',
    category_slug: 'breads-rice',
    description: 'Oven-fresh tandoori naan stuffed with melting mozzarella & cheddar, glazed with garlic cilantro butter',
    price: 450,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=700',
    badge: 'Freshly Baked',
    rating: 4.9
  },
  {
    id: 'f15',
    name: 'Roghni Naan',
    category: 'Breads & Rice',
    category_slug: 'breads-rice',
    description: 'Traditional sesame-sprinkled fluffy tandoori flatbread brushed with pure desi ghee',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700',
    badge: 'Tandoori',
    rating: 4.7
  },
  // Desserts & Drinks
  {
    id: 'f16',
    name: 'Kolachi Sea Breeze Mint Lemonade',
    category: 'Desserts & Drinks',
    category_slug: 'desserts-drinks',
    description: 'Crushed garden mint leaves, fresh lime juice, sparkling soda and pink rock salt',
    price: 490,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700',
    badge: 'Chilled',
    rating: 4.9
  },
  {
    id: 'f17',
    name: 'Shahi Kulfi Falooda',
    category: 'Desserts & Drinks',
    category_slug: 'desserts-drinks',
    description: 'Traditional rich malai kulfi served with rose syrup, basil seeds, rabri and vermicelli',
    price: 750,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700',
    badge: 'Sweet Delight',
    rating: 4.9
  }
];

export async function fetchMenuItems() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name, slug)')
      .eq('is_available', true);

    if (error || !data || data.length === 0) {
      console.log('Using local menu items fallback');
      return FALLBACK_MENU;
    }

    return data.map(item => ({
      ...item,
      category: item.categories ? item.categories.name : 'Main',
      category_slug: item.categories ? item.categories.slug : 'all'
    }));
  } catch (err) {
    console.warn('Supabase fetch failed, using fallback:', err);
    return FALLBACK_MENU;
  }
}

export function renderMenu(items, containerEl) {
  if (!containerEl) return;
  if (items.length === 0) {
    containerEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No dishes found matching your selection.</p>`;
    return;
  }

  containerEl.innerHTML = items.map(item => `
    <div class="food-card" data-category="${item.category_slug || 'all'}">
      <div class="food-card-img-wrap">
        <img src="${item.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700'}" alt="${item.name}" loading="lazy" />
        ${item.badge ? `<span class="food-badge">${item.badge}</span>` : ''}
        <span class="food-rating"><i class="fa-solid fa-star"></i> ${item.rating || 4.8}</span>
      </div>
      <div class="food-card-body">
        <h3 class="food-title">${item.name}</h3>
        <p class="food-desc">${item.description || 'Authentic Kolachi house preparation with hand-picked spices.'}</p>
        <div class="food-footer">
          <div class="food-price">
            <span class="curr">Price</span>
            <span class="val">Rs ${Number(item.price).toLocaleString()}</span>
          </div>
          <div class="food-action-btns">
            <button class="add-cart-btn" data-id="${item.id}" data-name="${encodeURIComponent(item.name)}" data-price="${item.price}" title="Add to cart">
              <i class="fa-solid fa-cart-plus"></i> Add
            </button>
            <a href="portal.html?orderItem=${encodeURIComponent(item.id)}" class="order-now-link" data-id="${item.id}" data-name="${encodeURIComponent(item.name)}" data-price="${item.price}">
              <i class="fa-solid fa-bolt"></i> Order Food
            </a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Attach event listeners for Add to Cart
  containerEl.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const name = decodeURIComponent(btn.getAttribute('data-name'));
      const price = parseFloat(btn.getAttribute('data-price'));
      addToCart({ id, name, price });
    });
  });

  // Attach event listeners for direct "Order Food" link
  containerEl.querySelectorAll('.order-now-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('data-id');
      const name = decodeURIComponent(link.getAttribute('data-name'));
      const price = parseFloat(link.getAttribute('data-price'));
      addToCart({ id, name, price });
      // redirects directly to portal.html to finish order placement
    });
  });
}
