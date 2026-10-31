/**
 * SK.SHOP.PK - Main Application Controller
 * Handles SPA Routing, UI Rendering, Cart Interactions, Checkout, Admin, Search
 */

class AppController {
  constructor() {
    this.currentFilter = {
      gender: 'all',
      category: 'all',
      subcat: 'all',
      sort: 'featured',
      query: '',
      badge: 'all'
    };
    this.selectedQuickViewProduct = null;
    this.selectedVariant = null;
    this.quickViewQty = 1;
    this.appliedCouponCode = '';
    this.init();
  }

  init() {
    // Hide loading screen after DOM ready
    window.addEventListener('load', () => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
      }
    });

    // Populate Pakistani cities in checkout
    this.populateCities();

    // Setup router
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();

    // Subscribe to store updates
    window.store.subscribe('cart_updated', () => this.updateCartUI());
    window.store.subscribe('wishlist_updated', () => this.updateWishlistUI());
    window.store.subscribe('products_updated', () => {
      this.renderHomeProducts();
      this.renderShopProducts();
      this.renderAdminProducts();
      this.renderAdminAnalytics();
    });
    window.store.subscribe('orders_updated', () => {
      this.renderAdminOrders();
      this.renderAdminAnalytics();
    });
    window.store.subscribe('coupons_updated', () => {
      this.renderAdminCoupons();
    });

    // Initial renders
    this.updateCartUI();
    this.updateWishlistUI();
    this.renderHomeProducts();
    this.setupLiveSearch();
    this.startCountdownTimer();
    this.setupMobileMenu();
  }

  // --- SPA ROUTING ---
  handleRoute() {
    const rawHash = window.location.hash.slice(1) || 'home';
    const [path, queryString] = rawHash.split('?');
    const segments = path.split('/');
    const mainRoute = segments[0] || 'home';
    const subRoute = segments[1] || null;

    // Parse query params if any
    if (queryString) {
      const params = new URLSearchParams(queryString);
      if (params.get('filter')) {
        this.currentFilter.badge = params.get('filter');
      }
    } else {
      this.currentFilter.badge = 'all';
    }

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => view.classList.remove('active'));

    // Highlight active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const navTarget = link.getAttribute('data-nav');
      if (navTarget === mainRoute || (mainRoute === 'category' && navTarget === subRoute)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Route dispatch
    switch (mainRoute) {
      case 'home':
        document.getElementById('view-home').classList.add('active');
        this.renderHomeProducts();
        break;

      case 'shop':
        document.getElementById('view-shop').classList.add('active');
        this.renderShopProducts();
        break;

      case 'category':
        document.getElementById('view-category').classList.add('active');
        this.renderCategoryPage(subRoute);
        break;

      case 'wishlist':
        document.getElementById('view-wishlist').classList.add('active');
        this.renderWishlistPage();
        break;

      case 'checkout':
        document.getElementById('view-checkout').classList.add('active');
        this.renderCheckoutPage();
        break;

      case 'order-confirmation':
        document.getElementById('view-order-confirmation').classList.add('active');
        this.renderOrderConfirmation(subRoute);
        break;

      case 'order-tracking':
        document.getElementById('view-order-tracking').classList.add('active');
        break;

      case 'contact':
        document.getElementById('view-contact').classList.add('active');
        break;

      case 'admin':
        document.getElementById('view-admin').classList.add('active');
        this.renderAdminView();
        break;

      case 'product':
        if (subRoute) {
          const prod = window.store.getProductById(subRoute);
          if (prod) {
            this.openQuickView(prod.id);
          }
        }
        break;

      default:
        document.getElementById('view-home').classList.add('active');
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- CITIES POPULATION ---
  populateCities() {
    const citySelect = document.getElementById('checkout-city');
    if (!citySelect) return;
    citySelect.innerHTML = '<option value="" disabled selected>Select Your Pakistani City...</option>';
    PAKISTANI_CITIES.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  // --- PRODUCT CARDS GENERATOR ---
  createProductCardHTML(p) {
    const isWished = window.store.isInWishlist(p.id);
    const discountPct = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const stockBadge = p.stock <= 5 ? `<span class="badge-pill" style="background:#EF4444; color:#FFF;">Only ${p.stock} Left</span>` : '';

    return `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-thumb-wrap" onclick="window.app.openQuickView('${p.id}')">
          <img src="${p.images[0] || 'assets/logo.jpg'}" alt="${p.name}" class="product-thumb-img" loading="lazy">
          
          <div class="product-badges">
            ${discountPct > 0 ? `<span class="badge-pill badge-discount">-${discountPct}% OFF</span>` : ''}
            ${p.isBestSeller ? `<span class="badge-pill badge-bestseller"><i class="fa-solid fa-crown"></i> Best Seller</span>` : ''}
            ${p.isNew ? `<span class="badge-pill badge-new">New Arrival</span>` : ''}
            ${stockBadge}
          </div>

          <button class="product-wishlist-btn ${isWished ? 'active' : ''}" onclick="event.stopPropagation(); window.app.toggleWishlist('${p.id}')" title="Save to Wishlist">
            <i class="${isWished ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>

          <div class="product-quick-view-overlay">
            <span style="color:#FFF; font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">
              <i class="fa-regular fa-eye"></i> Quick View
            </span>
          </div>
        </div>

        <div class="product-info">
          <div class="product-brand">${p.brand || 'SK Luxe'} • ${p.category}</div>
          <h3 class="product-title" onclick="window.app.openQuickView('${p.id}')" title="${p.name}">${p.name}</h3>
          
          <div class="product-rating">
            <span>${'★'.repeat(Math.round(p.rating || 5))}${'☆'.repeat(5 - Math.round(p.rating || 5))}</span>
            <span style="font-weight:700; color:#0A1128;">${p.rating}</span>
            <span class="product-rating-count">(${p.reviewCount || 10})</span>
          </div>

          <div class="product-price-wrap">
            <span class="product-price">Rs. ${p.price.toLocaleString()}</span>
            ${p.originalPrice ? `<span class="product-original-price">Rs. ${p.originalPrice.toLocaleString()}</span>` : ''}
          </div>

          <div class="product-actions">
            <button class="btn-card-add" onclick="window.app.handleAddToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn-card-buy" onclick="window.app.handleBuyNow('${p.id}')">
              <i class="fa-solid fa-bolt"></i> Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- HOME PRODUCTS RENDER ---
  renderHomeProducts() {
    const products = window.store.getProducts();

    // Best sellers (first 4 best sellers)
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
    const bsContainer = document.getElementById('home-bestsellers-grid');
    if (bsContainer) {
      bsContainer.innerHTML = bestSellers.map(p => this.createProductCardHTML(p)).join('');
    }

    // New arrivals (first 4 new arrivals)
    const newArrivals = products.filter(p => p.isNew).slice(0, 4);
    const newContainer = document.getElementById('home-new-arrivals-grid');
    if (newContainer) {
      newContainer.innerHTML = newArrivals.map(p => this.createProductCardHTML(p)).join('');
    }
  }

  // --- SHOP CATALOG RENDER ---
  renderShopProducts() {
    const products = window.store.getProducts();
    let filtered = [...products];

    // Gender filter
    if (this.currentFilter.gender !== 'all') {
      filtered = filtered.filter(p => p.gender === this.currentFilter.gender);
    }

    // Category filter
    if (this.currentFilter.category !== 'all') {
      filtered = filtered.filter(p => p.category === this.currentFilter.category);
    }

    // Badge filter (from query string e.g. new, bestseller, offer)
    if (this.currentFilter.badge === 'new') {
      filtered = filtered.filter(p => p.isNew);
    } else if (this.currentFilter.badge === 'bestseller') {
      filtered = filtered.filter(p => p.isBestSeller);
    } else if (this.currentFilter.badge === 'offer') {
      filtered = filtered.filter(p => p.isOffer || (p.originalPrice && p.originalPrice > p.price));
    }

    // Search query
    if (this.currentFilter.query) {
      const q = this.currentFilter.query.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (this.currentFilter.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured
        break;
    }

    const grid = document.getElementById('shop-products-grid');
    const emptyState = document.getElementById('shop-empty-state');
    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        grid.innerHTML = filtered.map(p => this.createProductCardHTML(p)).join('');
      }
    }
  }

  setShopFilter(type, value) {
    if (type === 'gender') {
      this.currentFilter.gender = value;
      document.querySelectorAll('#shop-gender-filters .filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(value) || (value === 'all' && btn.textContent.includes('All')));
      });
    } else if (type === 'category') {
      this.currentFilter.category = value;
      document.querySelectorAll('#shop-category-pills .filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase().includes(value) || (value === 'all' && btn.textContent.includes('All')));
      });
    }
    this.renderShopProducts();
  }

  handleSortChange(val) {
    this.currentFilter.sort = val;
    this.renderShopProducts();
  }

  resetAllFilters() {
    this.currentFilter = {
      gender: 'all',
      category: 'all',
      subcat: 'all',
      sort: 'featured',
      query: '',
      badge: 'all'
    };
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes('All'));
    });
    this.renderShopProducts();
  }

  // --- DEDICATED CATEGORY PAGE RENDER ---
  renderCategoryPage(catKey) {
    const meta = CATEGORIES_METADATA.find(c => c.id === catKey) || CATEGORIES_METADATA[0];
    
    document.getElementById('cat-crumb-name').textContent = meta.name;
    document.getElementById('cat-page-title').textContent = meta.name;
    document.getElementById('cat-page-desc').textContent = meta.tagline;

    // Subcategories bar
    const subBar = document.getElementById('cat-subcategories-bar');
    if (subBar) {
      let subHTML = `<button class="filter-pill active" onclick="window.app.filterCategoryBySubcat('all', this)">All ${meta.name}</button>`;
      meta.subcategories.forEach(sub => {
        subHTML += `<button class="filter-pill" onclick="window.app.filterCategoryBySubcat('${sub}', this)">${sub}</button>`;
      });
      subBar.innerHTML = subHTML;
    }

    // Filter products
    const products = window.store.getProducts();
    let prods = [];
    if (meta.id === 'ladies' || meta.id === 'gents' || meta.id === 'unisex') {
      prods = products.filter(p => p.gender === meta.id);
    } else {
      prods = products.filter(p => p.category === meta.id);
    }

    const grid = document.getElementById('category-products-grid');
    if (grid) {
      grid.innerHTML = prods.map(p => this.createProductCardHTML(p)).join('');
    }
  }

  filterCategoryBySubcat(subcat, btn) {
    document.querySelectorAll('#cat-subcategories-bar .filter-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const catKey = window.location.hash.split('/')[1] || 'ladies';
    const meta = CATEGORIES_METADATA.find(c => c.id === catKey) || CATEGORIES_METADATA[0];
    const products = window.store.getProducts();

    let prods = [];
    if (meta.id === 'ladies' || meta.id === 'gents' || meta.id === 'unisex') {
      prods = products.filter(p => p.gender === meta.id);
    } else {
      prods = products.filter(p => p.category === meta.id);
    }

    if (subcat !== 'all') {
      prods = prods.filter(p => p.subcategory && p.subcategory.toLowerCase() === subcat.toLowerCase());
    }

    const grid = document.getElementById('category-products-grid');
    if (grid) {
      grid.innerHTML = prods.map(p => this.createProductCardHTML(p)).join('');
    }
  }

  // --- WISHLIST PAGE RENDER ---
  renderWishlistPage() {
    const wishlistIds = window.store.getWishlist();
    const products = window.store.getProducts();
    const wishedProducts = products.filter(p => wishlistIds.includes(p.id));

    const grid = document.getElementById('wishlist-grid');
    const empty = document.getElementById('wishlist-empty');

    if (wishedProducts.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      grid.innerHTML = wishedProducts.map(p => this.createProductCardHTML(p)).join('');
    }
  }

  toggleWishlist(productId) {
    const added = window.store.toggleWishlist(productId);
    this.showToast(added ? 'Added to Wishlist' : 'Removed from Wishlist', added ? 'heart' : 'heart-crack');
  }

  updateWishlistUI() {
    const count = window.store.getWishlistCount();
    const badge = document.getElementById('wishlist-badge');
    if (badge) badge.textContent = count;
  }

  // --- CART INTERACTIONS ---
  handleAddToCart(productId, variantName = null, qty = 1) {
    window.store.addToCart(productId, variantName, qty);
    const prod = window.store.getProductById(productId);
    this.showToast(`Added "${prod ? prod.name : 'Product'}" to bag!`, 'cart-plus');
    this.openCartDrawer();
  }

  handleBuyNow(productId, variantName = null, qty = 1) {
    window.store.addToCart(productId, variantName, qty);
    this.closeQuickView();
    this.closeCartDrawer();
    window.location.hash = '#checkout';
  }

  openCartDrawer() {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-drawer-overlay').classList.add('active');
  }

  closeCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-drawer-overlay').classList.remove('active');
  }

  updateCartUI() {
    const cart = window.store.getCart();
    const totals = window.store.getCartTotals(this.appliedCouponCode);

    // Update Header Badge
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = window.store.getCartCount();

    // Render Drawer Items
    const body = document.getElementById('cart-drawer-body');
    if (body) {
      if (cart.length === 0) {
        body.innerHTML = `
          <div style="text-align:center; padding:3rem 1rem;">
            <i class="fa-solid fa-bag-shopping" style="font-size:3rem; color:#CBD5E1; margin-bottom:1rem;"></i>
            <h4 style="font-family:'Playfair Display',serif; color:#0A1128;">Your shopping bag is empty</h4>
            <p style="font-size:0.85rem; color:#64748B; margin-top:0.35rem;">Discover our luxury cosmetic creations</p>
            <button onclick="window.app.closeCartDrawer(); location.hash='#shop'" class="btn btn-primary btn-sm" style="margin-top:1.25rem;">Start Shopping</button>
          </div>
        `;
      } else {
        body.innerHTML = cart.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              ${item.variantName ? `<div class="cart-item-variant">Variant: ${item.variantName}</div>` : ''}
              <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
              <div class="cart-item-controls">
                <div class="qty-control">
                  <button class="qty-btn" onclick="window.store.updateCartQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
                  <input type="text" class="qty-input" value="${item.quantity}" readonly>
                  <button class="qty-btn" onclick="window.store.updateCartQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
                </div>
                <button class="cart-remove-btn" onclick="window.store.removeFromCart('${item.cartItemId}')">Remove</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // Free shipping bar
    const fill = document.getElementById('cart-shipping-fill');
    const text = document.getElementById('cart-shipping-text');
    if (fill && text) {
      if (totals.subtotal >= STORE_CONFIG.freeShippingThreshold) {
        fill.style.width = '100%';
        text.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked FREE Delivery across Pakistan!`;
      } else {
        const pct = Math.min(100, (totals.subtotal / STORE_CONFIG.freeShippingThreshold) * 100);
        fill.style.width = `${pct}%`;
        text.innerHTML = `Add <strong>Rs. ${totals.freeShippingLeft.toLocaleString()}</strong> more for <strong>FREE Nationwide Delivery</strong>!`;
      }
    }

    // Totals in Drawer
    const subtotalEl = document.getElementById('cart-subtotal');
    const delivEl = document.getElementById('cart-delivery-fee');
    const grandEl = document.getElementById('cart-grand-total');

    if (subtotalEl) subtotalEl.textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
    if (delivEl) delivEl.textContent = totals.shipping === 0 ? 'FREE' : `Rs. ${totals.shipping}`;
    if (grandEl) grandEl.textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;
  }

  proceedToCheckout() {
    this.closeCartDrawer();
    window.location.hash = '#checkout';
  }

  // --- CHECKOUT PAGE RENDER & SUBMISSION ---
  renderCheckoutPage() {
    const cart = window.store.getCart();
    if (cart.length === 0) {
      const container = document.getElementById('checkout-items-list');
      if (container) {
        container.innerHTML = `
          <div style="text-align:center; padding:2rem 0;">
            <p style="color:#64748B;">Your shopping cart is currently empty.</p>
            <a href="#shop" class="btn btn-primary btn-sm" style="margin-top:1rem;">Browse Products</a>
          </div>
        `;
      }
      return;
    }

    // Render Items
    const itemsList = document.getElementById('checkout-items-list');
    if (itemsList) {
      itemsList.innerHTML = cart.map(item => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.6rem 0; border-bottom:1px solid #F1F5F9; font-size:0.88rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <img src="${item.image}" style="width:38px; height:38px; object-fit:cover; border-radius:4px;">
            <div>
              <div style="font-weight:600; color:#0A1128;">${item.name}</div>
              <div style="font-size:0.75rem; color:#64748B;">Qty: ${item.quantity} ${item.variantName ? `(${item.variantName})` : ''}</div>
            </div>
          </div>
          <div style="font-weight:700; color:#0A1128;">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
        </div>
      `).join('');
    }

    this.updateCheckoutTotals();
  }

  updateCheckoutTotals() {
    const totals = window.store.getCartTotals(this.appliedCouponCode);

    document.getElementById('checkout-subtotal').textContent = `Rs. ${totals.subtotal.toLocaleString()}`;
    document.getElementById('checkout-shipping').textContent = totals.shipping === 0 ? 'FREE' : `Rs. ${totals.shipping}`;
    
    const discRow = document.getElementById('checkout-discount-row');
    if (totals.discount > 0) {
      discRow.style.display = 'flex';
      document.getElementById('checkout-discount').textContent = `-Rs. ${totals.discount.toLocaleString()} (${totals.appliedCoupon ? totals.appliedCoupon.code : ''})`;
    } else {
      discRow.style.display = 'none';
    }

    document.getElementById('checkout-grand-total').textContent = `Rs. ${totals.grandTotal.toLocaleString()}`;
  }

  applyCouponFromCheckout() {
    const input = document.getElementById('checkout-coupon-input');
    const feedback = document.getElementById('coupon-feedback');
    if (!input || !feedback) return;

    const code = input.value.trim().toUpperCase();
    const totals = window.store.getCartTotals();
    const result = window.store.validateCoupon(code, totals.subtotal);

    if (result.valid) {
      this.appliedCouponCode = code;
      feedback.style.color = '#10B981';
      feedback.textContent = `Coupon applied! ${result.coupon.description}`;
      this.updateCheckoutTotals();
      this.showToast(`Coupon "${code}" applied successfully!`, 'tag');
    } else {
      feedback.style.color = '#EF4444';
      feedback.textContent = result.message;
    }
  }

  syncPhoneToWhatsApp(isChecked) {
    const phone = document.getElementById('checkout-phone').value;
    const whatsapp = document.getElementById('checkout-whatsapp');
    if (isChecked) {
      whatsapp.value = phone;
    }
  }

  selectPaymentMethod(type) {
    document.getElementById('opt-cod').classList.toggle('selected', type === 'cod');
    document.getElementById('opt-online').classList.toggle('selected', type === 'online');
    
    const placeBtn = document.getElementById('place-order-btn');
    if (type === 'cod') {
      placeBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order (Cash on Delivery)`;
    } else {
      placeBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order (Direct Bank Transfer)`;
    }
  }

  handleCheckoutSubmit(form) {
    const cart = window.store.getCart();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add products before placing an order.');
      return;
    }

    const formData = new FormData(form);
    const totals = window.store.getCartTotals(this.appliedCouponCode);

    const orderData = {
      customerName: formData.get('customerName'),
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp') || formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      notes: formData.get('notes'),
      paymentMethod: formData.get('paymentMethod'),
      items: cart,
      subtotal: totals.subtotal,
      discount: totals.discount,
      couponCode: this.appliedCouponCode,
      shipping: totals.shipping,
      total: totals.grandTotal
    };

    // Save order in real store database
    const savedOrder = window.store.createOrder(orderData);

    // Redirect to Order Confirmation
    window.location.hash = `#order-confirmation/${savedOrder.id}`;
    this.showToast(`Order ${savedOrder.id} successfully placed!`, 'check-circle');
  }

  // --- ORDER CONFIRMATION VIEW ---
  renderOrderConfirmation(orderId) {
    const order = window.store.getOrderById(orderId);
    if (!order) {
      document.getElementById('confirmed-order-id').textContent = 'Order Not Found';
      document.getElementById('confirmed-order-details').innerHTML = '<p>Unable to locate this order. Please contact our support team at 0302 3912469.</p>';
      return;
    }

    document.getElementById('confirmed-order-id').textContent = `Order ID: ${order.id}`;

    const itemsSummary = order.items.map(item => `
      <div style="display:flex; justify-content:space-between; margin-bottom:0.4rem; font-size:0.9rem;">
        <span>${item.name} (${item.quantity}x)</span>
        <strong>Rs. ${(item.price * item.quantity).toLocaleString()}</strong>
      </div>
    `).join('');

    document.getElementById('confirmed-order-details').innerHTML = `
      <div style="border-bottom:1px solid #E2E8F0; padding-bottom:1rem; margin-bottom:1rem;">
        <h4 style="font-family:'Playfair Display',serif; color:#0A1128; font-size:1.15rem; margin-bottom:0.4rem;">Customer & Shipping Information</h4>
        <div style="font-size:0.88rem; color:#475569; line-height:1.6;">
          <div><strong>Recipient:</strong> ${order.customerName}</div>
          <div><strong>Mobile:</strong> ${order.phone} | <strong>WhatsApp:</strong> ${order.whatsapp}</div>
          <div><strong>Destination:</strong> ${order.address}, ${order.city} (Postal: ${order.postalCode})</div>
          <div><strong>Payment Method:</strong> ${order.paymentMethod}</div>
          <div><strong>Estimated Dispatch:</strong> Within 24-48 Hours via TCS / Leopards Courier</div>
        </div>
      </div>

      <div style="border-bottom:1px solid #E2E8F0; padding-bottom:1rem; margin-bottom:1rem;">
        <h4 style="font-family:'Playfair Display',serif; color:#0A1128; font-size:1.15rem; margin-bottom:0.6rem;">Ordered Items</h4>
        ${itemsSummary}
      </div>

      <div style="font-size:0.92rem; color:#475569; line-height:1.7;">
        <div style="display:flex; justify-content:space-between;">
          <span>Subtotal:</span>
          <span>Rs. ${order.subtotal.toLocaleString()}</span>
        </div>
        ${order.discount > 0 ? `
          <div style="display:flex; justify-content:space-between; color:#10B981;">
            <span>Discount (${order.couponCode}):</span>
            <span>-Rs. ${order.discount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div style="display:flex; justify-content:space-between;">
          <span>Delivery Charges:</span>
          <span>${order.shipping === 0 ? 'FREE' : 'Rs. ' + order.shipping}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:1.25rem; font-weight:800; color:#0A1128; border-top:1px dashed #CBD5E1; padding-top:0.5rem; margin-top:0.4rem;">
          <span>Grand Total Payable:</span>
          <span class="gold-text">Rs. ${order.total.toLocaleString()}</span>
        </div>
      </div>
    `;

    // Setup direct WhatsApp Order Confirmation button (Req #7 & #9)
    const waText = `Hello SK.SHOP.PK! I have placed an order.\n\nOrder ID: ${order.id}\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nCity: ${order.city}\nTotal Amount: Rs. ${order.total.toLocaleString()}\nPayment: ${order.paymentMethod}\n\nPlease confirm my order dispatch. Thank you!`;
    const waUrl = `https://wa.me/923023912469?text=${encodeURIComponent(waText)}`;
    
    const waBtn = document.getElementById('confirm-whatsapp-btn');
    if (waBtn) waBtn.href = waUrl;
  }

  // --- ORDER TRACKING ---
  handleOrderTrackSubmit() {
    const input = document.getElementById('track-input');
    const resultBox = document.getElementById('tracking-result-box');
    if (!input || !resultBox) return;

    const val = input.value.trim();
    const order = window.store.trackOrder(val);

    resultBox.style.display = 'block';

    if (!order) {
      resultBox.innerHTML = `
        <div style="text-align:center; padding:1.5rem; background:#FEF2F2; border:1px solid #FCA5A5; border-radius:8px; color:#991B1B;">
          <i class="fa-solid fa-circle-exclamation" style="font-size:1.5rem; margin-bottom:0.5rem;"></i>
          <div style="font-weight:700;">No Order Found</div>
          <p style="font-size:0.85rem; margin-top:0.25rem;">We could not locate an order matching "${val}". Please check your Order ID or contact us on WhatsApp at 0302 3912469.</p>
        </div>
      `;
      return;
    }

    // Determine timeline step
    const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

    resultBox.innerHTML = `
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:1.75rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid #E2E8F0; padding-bottom:1rem; margin-bottom:1.5rem;">
          <div>
            <span class="order-id-badge" style="margin:0;">${order.id}</span>
            <div style="font-size:0.82rem; color:#64748B; margin-top:0.35rem;">Customer: <strong>${order.customerName}</strong> (${order.city})</div>
          </div>
          <div>
            <span class="status-pill status-${order.status.toLowerCase()}">${order.status}</span>
          </div>
        </div>

        <!-- Timeline Graphic -->
        <div class="order-timeline">
          ${steps.map((st, i) => `
            <div class="timeline-step ${i <= currentIdx ? 'completed' : ''} ${i === currentIdx ? 'active' : ''}">
              <div class="timeline-dot"><i class="fa-solid ${i < currentIdx ? 'fa-check' : (i === currentIdx ? 'fa-truck' : 'fa-clock')}"></i></div>
              <div class="timeline-label">${st}</div>
            </div>
          `).join('')}
        </div>

        <div style="font-size:0.88rem; color:#475569; margin-top:1.5rem; border-top:1px dashed #CBD5E1; padding-top:1rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
          <div><strong>Courier Tracking:</strong> ${order.trackingNumber || 'Assigned upon courier pickup'}</div>
          <div><strong>Order Total:</strong> Rs. ${order.total.toLocaleString()} (${order.paymentMethod})</div>
        </div>

        <div style="text-align:center; margin-top:1.25rem;">
          <a href="https://wa.me/923023912469?text=${encodeURIComponent(`Hello SK.SHOP.PK! I am inquiring about my Order ${order.id}. Current status is: ${order.status}.`)}" target="_blank" class="btn btn-whatsapp btn-sm">
            <i class="fa-brands fa-whatsapp"></i> Inquire about Order on WhatsApp
          </a>
        </div>
      </div>
    `;
  }

  // --- QUICK VIEW MODAL & REVIEWS ---
  openQuickView(productId) {
    const p = window.store.getProductById(productId);
    if (!p) return;

    this.selectedQuickViewProduct = p;
    this.selectedVariant = (p.variants && p.variants.length > 0) ? p.variants[0] : null;
    this.quickViewQty = 1;

    // Track recently viewed
    window.store.addRecentlyViewed(p.id);

    const content = document.getElementById('quickview-content');
    if (!content) return;

    const discountPct = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const currentPrice = this.selectedVariant ? this.selectedVariant.price : p.price;

    content.innerHTML = `
      <div class="quickview-grid">
        <!-- Gallery -->
        <div class="quickview-gallery">
          <img id="quickview-active-img" src="${p.images[0]}" alt="${p.name}" class="quickview-main-img">
          <div class="quickview-thumbnails">
            ${p.images.map((img, i) => `
              <img src="${img}" class="quickview-thumb ${i === 0 ? 'active' : ''}" onclick="window.app.switchQuickViewImg('${img}', this)">
            `).join('')}
          </div>
        </div>

        <!-- Details -->
        <div class="quickview-details">
          <div class="quickview-brand">${p.brand || 'SK Luxe'} • ${p.category}</div>
          <h2 class="quickview-title">${p.name}</h2>
          
          <div class="product-rating" style="margin-bottom:1rem;">
            <span>${'★'.repeat(Math.round(p.rating || 5))}${'☆'.repeat(5 - Math.round(p.rating || 5))}</span>
            <span style="font-weight:700; color:#0A1128;">${p.rating}</span>
            <span class="product-rating-count">(${p.reviewCount || 10} verified customer reviews)</span>
          </div>

          <div class="quickview-price-wrap">
            <span id="quickview-dyn-price" class="quickview-price">Rs. ${currentPrice.toLocaleString()}</span>
            ${p.originalPrice ? `<span class="quickview-original">Rs. ${p.originalPrice.toLocaleString()}</span>` : ''}
            ${discountPct > 0 ? `<span class="badge-pill badge-discount">Save ${discountPct}%</span>` : ''}
          </div>

          <p class="quickview-desc">${p.description}</p>

          <!-- Variants Picker -->
          ${p.variants && p.variants.length > 0 ? `
            <div class="variant-picker">
              <span class="variant-label">Available Sizes / Volumes:</span>
              <div class="variant-options">
                ${p.variants.map((v, i) => `
                  <button class="variant-btn ${i === 0 ? 'active' : ''}" onclick="window.app.selectVariant('${v.name}', ${v.price}, this)">
                    ${v.name} - Rs. ${v.price.toLocaleString()}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Quantity Stepper -->
          <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
            <span style="font-size:0.85rem; font-weight:700;">Quantity:</span>
            <div class="qty-control">
              <button class="qty-btn" onclick="window.app.adjustQuickViewQty(-1)">-</button>
              <input type="text" id="quickview-qty-input" class="qty-input" value="1" readonly>
              <button class="qty-btn" onclick="window.app.adjustQuickViewQty(1)">+</button>
            </div>
            <span style="font-size:0.82rem; color:${p.stock > 5 ? '#10B981' : '#EF4444'}; font-weight:600;">
              <i class="fa-solid fa-check"></i> ${p.stock > 0 ? `In Stock (${p.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <!-- CTAs -->
          <div class="quickview-cta-group">
            <button class="btn btn-dark" onclick="window.app.addCurrentQuickViewToCart()">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="btn btn-primary" onclick="window.app.buyCurrentQuickViewNow()">
              <i class="fa-solid fa-bolt"></i> Buy Now
            </button>
          </div>

          <!-- Direct WhatsApp Order Option (Req #7) -->
          <a id="quickview-wa-link" href="#" target="_blank" class="btn btn-whatsapp" style="margin-bottom:1.5rem;">
            <i class="fa-brands fa-whatsapp"></i> Order this on WhatsApp (0302 3912469)
          </a>

          <!-- Specifications Table -->
          ${p.specs ? `
            <table class="specs-table">
              ${Object.entries(p.specs).map(([k, val]) => `
                <tr>
                  <td>${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                  <td>${val}</td>
                </tr>
              `).join('')}
            </table>
          ` : ''}
        </div>
      </div>

      <!-- Reviews Section inside Modal -->
      <div style="padding:2rem 2.5rem; background:#F8FAFC; border-top:1px solid #E2E8F0;">
        <h3 style="font-family:'Playfair Display',serif; font-size:1.4rem; color:#0A1128; margin-bottom:1.25rem;">
          Customer Reviews & Ratings (${(p.reviews || []).length})
        </h3>
        
        <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:2rem;">
          <!-- Existing reviews list -->
          <div style="display:flex; flex-direction:column; gap:0.75rem; max-height:260px; overflow-y:auto;">
            ${(p.reviews && p.reviews.length > 0) ? p.reviews.map(r => `
              <div style="background:#FFF; padding:0.9rem; border-radius:8px; border:1px solid #E2E8F0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                  <strong style="font-size:0.85rem; color:#0A1128;">${r.author}</strong>
                  <span style="font-size:0.75rem; color:#64748B;">${r.date}</span>
                </div>
                <div style="color:#F59E0B; font-size:0.75rem; margin-bottom:0.35rem;">${'★'.repeat(r.rating)}</div>
                <p style="font-size:0.82rem; color:#475569;">"${r.comment}"</p>
              </div>
            `).join('') : '<p style="color:#64748B; font-size:0.85rem;">Be the first to review this product!</p>'}
          </div>

          <!-- Add Review Form -->
          <div style="background:#FFF; padding:1.25rem; border-radius:8px; border:1px solid #E2E8F0;">
            <h4 style="font-size:0.95rem; font-weight:700; color:#0A1128; margin-bottom:0.75rem;">Write a Review</h4>
            <form onsubmit="event.preventDefault(); window.app.handleReviewSubmit(this, '${p.id}');">
              <div class="form-group" style="margin-bottom:0.6rem;">
                <input type="text" name="author" class="form-control" style="font-size:0.85rem; padding:0.45rem 0.75rem;" placeholder="Your Name (e.g. Sana R. - Lahore)" required>
              </div>
              <div class="form-group" style="margin-bottom:0.6rem;">
                <select name="rating" class="form-control" style="font-size:0.85rem; padding:0.45rem 0.75rem;">
                  <option value="5">★★★★★ (5 Stars - Excellent)</option>
                  <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                  <option value="3">★★★☆☆ (3 Stars - Average)</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0.6rem;">
                <textarea name="comment" class="form-control" rows="2" style="font-size:0.85rem;" placeholder="Share your experience..." required></textarea>
              </div>
              <button type="submit" class="btn btn-dark btn-sm" style="width:100%;">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    `;

    this.updateQuickViewWhatsAppLink();
    document.getElementById('quickview-modal').classList.add('active');
  }

  closeQuickView() {
    document.getElementById('quickview-modal').classList.remove('active');
  }

  switchQuickViewImg(src, thumbEl) {
    document.getElementById('quickview-active-img').src = src;
    document.querySelectorAll('.quickview-thumb').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
  }

  selectVariant(variantName, price, btnEl) {
    if (this.selectedQuickViewProduct) {
      this.selectedVariant = { name: variantName, price };
      document.getElementById('quickview-dyn-price').textContent = `Rs. ${price.toLocaleString()}`;
      document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
      if (btnEl) btnEl.classList.add('active');
      this.updateQuickViewWhatsAppLink();
    }
  }

  adjustQuickViewQty(delta) {
    this.quickViewQty = Math.max(1, this.quickViewQty + delta);
    document.getElementById('quickview-qty-input').value = this.quickViewQty;
    this.updateQuickViewWhatsAppLink();
  }

  updateQuickViewWhatsAppLink() {
    const p = this.selectedQuickViewProduct;
    if (!p) return;
    const vName = this.selectedVariant ? this.selectedVariant.name : 'Standard';
    const price = this.selectedVariant ? this.selectedVariant.price : p.price;
    const text = `Hello SK.SHOP.PK! I want to order:\n\n*${p.name}*\nVariant: ${vName}\nQuantity: ${this.quickViewQty}\nPrice: Rs. ${(price * this.quickViewQty).toLocaleString()}\n\nPlease confirm availability for Cash on Delivery.`;
    const url = `https://wa.me/923023912469?text=${encodeURIComponent(text)}`;
    const link = document.getElementById('quickview-wa-link');
    if (link) link.href = url;
  }

  addCurrentQuickViewToCart() {
    if (!this.selectedQuickViewProduct) return;
    const vName = this.selectedVariant ? this.selectedVariant.name : null;
    this.handleAddToCart(this.selectedQuickViewProduct.id, vName, this.quickViewQty);
  }

  buyCurrentQuickViewNow() {
    if (!this.selectedQuickViewProduct) return;
    const vName = this.selectedVariant ? this.selectedVariant.name : null;
    this.handleBuyNow(this.selectedQuickViewProduct.id, vName, this.quickViewQty);
  }

  handleReviewSubmit(form, productId) {
    const formData = new FormData(form);
    window.store.addReview(productId, {
      author: formData.get('author'),
      rating: formData.get('rating'),
      comment: formData.get('comment')
    });
    this.showToast('Thank you! Your review has been published.', 'star');
    this.openQuickView(productId); // re-render modal with new review
  }

  // --- LIVE SEARCH ---
  setupLiveSearch() {
    const input = document.getElementById('global-search-input');
    const dropdown = document.getElementById('search-dropdown');
    const searchBtn = document.getElementById('global-search-btn');

    if (!input || !dropdown) return;

    input.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      if (val.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      const products = window.store.getProducts();
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(val) ||
        p.brand.toLowerCase().includes(val) ||
        p.category.toLowerCase().includes(val) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(val))
      ).slice(0, 5);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div style="padding:1rem; text-align:center; color:#94A3B8; font-size:0.85rem;">
            No products found for "${val}"
          </div>
        `;
      } else {
        dropdown.innerHTML = matches.map(p => `
          <div class="search-result-item" onclick="window.app.handleSearchResultClick('${p.id}')">
            <img src="${p.images[0]}" alt="${p.name}" class="search-result-img">
            <div class="search-result-details">
              <div class="search-result-title">${p.name}</div>
              <div class="search-result-price">Rs. ${p.price.toLocaleString()}</div>
            </div>
            <i class="fa-solid fa-angle-right" style="color:#D4AF37; font-size:0.8rem;"></i>
          </div>
        `).join('') + `
          <div style="padding:0.6rem; text-align:center; background:rgba(212,175,55,0.08); border-top:1px solid rgba(212,175,55,0.2);">
            <button onclick="window.app.submitSearch('${val}')" style="color:#FFDF73; font-weight:700; font-size:0.82rem;">
              View all results for "${val}" →
            </button>
          </div>
        `;
      }

      dropdown.classList.add('active');
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Enter key trigger
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.submitSearch(input.value.trim());
      }
    });

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.submitSearch(input.value.trim());
      });
    }
  }

  handleSearchResultClick(productId) {
    document.getElementById('search-dropdown').classList.remove('active');
    this.openQuickView(productId);
  }

  submitSearch(query) {
    if (!query) return;
    document.getElementById('search-dropdown').classList.remove('active');
    this.currentFilter.query = query;
    window.location.hash = '#shop';
    this.renderShopProducts();
    document.getElementById('shop-page-title').textContent = `Search: "${query}"`;
  }

  // --- FLASH DEALS COUNTDOWN TIMER ---
  startCountdownTimer() {
    let timeLeft = 2 * 24 * 3600 + 14 * 3600 + 42 * 60 + 30; // 2d 14h 42m 30s
    setInterval(() => {
      timeLeft = Math.max(0, timeLeft - 1);
      const days = Math.floor(timeLeft / (24 * 3600));
      const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);
      const mins = Math.floor((timeLeft % 3600) / 60);
      const secs = timeLeft % 60;

      const dEl = document.getElementById('deal-days');
      const hEl = document.getElementById('deal-hours');
      const mEl = document.getElementById('deal-minutes');
      const sEl = document.getElementById('deal-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }, 1000);
  }

  // --- MOBILE MENU ---
  setupMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('close-mobile-menu');

    const openMenu = () => {
      drawer.style.transform = 'translateX(0)';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
    };

    const closeMenu = () => {
      drawer.style.transform = 'translateX(-100%)';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
    };

    if (toggle) toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.addEventListener('click', closeMenu);
    });
  }

  // --- NEWSLETTER & CONTACT FORM ---
  handleNewsletterSubmit(form) {
    this.showToast('Subscribed! Use code WELCOME10 for 10% off at checkout.', 'envelope-open');
    form.reset();
  }

  handleContactFormSubmit(form) {
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Build prefilled WhatsApp message
    const waText = `Hello SK.SHOP.PK!\n\nName: ${name}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}\n\nPlease respond to my inquiry.`;
    const waUrl = `https://wa.me/923023912469?text=${encodeURIComponent(waText)}`;

    window.open(waUrl, '_blank');
    this.showToast('Redirecting to WhatsApp to send your inquiry...', 'paper-plane');
    form.reset();
  }

  // --- ADMIN DASHBOARD ---
  renderAdminView() {
    const isLogged = window.store.isAdminLoggedIn();
    const loginBox = document.getElementById('admin-login-box');
    const dashboard = document.getElementById('admin-dashboard-content');

    if (!isLogged) {
      loginBox.style.display = 'block';
      dashboard.style.display = 'none';
    } else {
      loginBox.style.display = 'none';
      dashboard.style.display = 'block';
      this.renderAdminAnalytics();
      this.renderAdminOrders();
      this.renderAdminProducts();
      this.renderAdminCoupons();
    }
  }

  handleAdminLogin() {
    const pass = document.getElementById('admin-password-input').value;
    if (window.store.loginAdmin(pass)) {
      this.showToast('Admin authenticated successfully', 'unlock');
      this.renderAdminView();
    } else {
      alert('Incorrect Admin Security Password. Default is "skadmin2026"');
    }
  }

  handleAdminLogout() {
    window.store.logoutAdmin();
    this.showToast('Logged out of Admin Portal', 'lock');
    this.renderAdminView();
  }

  switchAdminTab(tabKey) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.toLowerCase().includes(tabKey));
    });

    document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
    const target = document.getElementById(`admin-tab-${tabKey}`);
    if (target) target.style.display = 'block';
  }

  renderAdminAnalytics() {
    const stats = window.store.getAnalytics();
    const orders = window.store.getOrders();
    const prods = window.store.getProducts();

    const ordCount = document.getElementById('stat-total-orders');
    const rev = document.getElementById('stat-total-revenue');
    const prdCount = document.getElementById('stat-total-products');
    const pend = document.getElementById('stat-pending-orders');

    if (ordCount) ordCount.textContent = stats.totalOrders;
    if (rev) rev.textContent = `Rs. ${stats.totalRevenue.toLocaleString()}`;
    if (prdCount) prdCount.textContent = stats.totalProducts;
    if (pend) pend.textContent = stats.pendingOrders;

    const ordTabBadge = document.getElementById('admin-orders-tab-count');
    const prdTabBadge = document.getElementById('admin-prods-tab-count');
    if (ordTabBadge) ordTabBadge.textContent = orders.length;
    if (prdTabBadge) prdTabBadge.textContent = prods.length;
  }

  renderAdminOrders() {
    const orders = window.store.getOrders();
    const tbody = document.getElementById('admin-orders-table-body');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:#64748B;">No customer orders placed yet.</td></tr>`;
      return;
    }

    const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>
          <strong style="color:#0A1128;">${o.id}</strong>
          <div style="font-size:0.75rem; color:#64748B;">${o.paymentMethod}</div>
        </td>
        <td>
          <div style="font-size:0.8rem; color:#64748B;">${new Date(o.date).toLocaleDateString()}</div>
          <div style="font-size:0.75rem; color:#94A3B8;">${new Date(o.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#0A1128;">${o.customerName}</div>
          <div style="font-size:0.75rem; color:#64748B;">📞 ${o.phone}</div>
        </td>
        <td>
          <div style="font-size:0.82rem; font-weight:600; color:#0A1128;">${o.city}</div>
          <div style="font-size:0.75rem; color:#64748B; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${o.address}">${o.address}</div>
        </td>
        <td>
          <div style="font-size:0.82rem;">${o.items.length} item(s)</div>
          <div style="font-size:0.75rem; color:#64748B; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${o.items.map(i => i.name).join(', ')}
          </div>
        </td>
        <td>
          <strong style="color:#0A1128; font-size:0.95rem;">Rs. ${o.total.toLocaleString()}</strong>
        </td>
        <td>
          <select onchange="window.app.handleOrderStatusChange('${o.id}', this.value)" style="padding:0.3rem 0.5rem; border-radius:4px; font-size:0.8rem; font-weight:700;">
            ${statuses.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <!-- 1-Click WhatsApp Customer Button (Req #8 & #9) -->
            <a href="https://wa.me/${o.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${o.customerName}! This is SK.SHOP.PK regarding your Order ${o.id}. Your order status is: ${o.status}. Thank you for shopping with us!`)}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding:0.25rem 0.6rem;" title="WhatsApp Customer">
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <button onclick="window.app.viewOrderDetailsInAlert('${o.id}')" class="btn btn-dark btn-sm" style="padding:0.25rem 0.6rem;" title="View Order Details">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  handleOrderStatusChange(orderId, newStatus) {
    window.store.updateOrderStatus(orderId, newStatus);
    this.showToast(`Order ${orderId} updated to ${newStatus}`, 'check-circle');
  }

  viewOrderDetailsInAlert(orderId) {
    const o = window.store.getOrderById(orderId);
    if (!o) return;
    const summary = `ORDER: ${o.id}\nCustomer: ${o.customerName}\nPhone: ${o.phone} / WhatsApp: ${o.whatsapp}\nAddress: ${o.address}, ${o.city}\nStatus: ${o.status}\n\nITEMS:\n${o.items.map(i => `- ${i.name} (x${i.quantity}) = Rs. ${i.price * i.quantity}`).join('\n')}\n\nTotal: Rs. ${o.total.toLocaleString()}`;
    alert(summary);
  }

  renderAdminProducts() {
    const products = window.store.getProducts();
    const tbody = document.getElementById('admin-products-table-body');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>
          <img src="${p.images[0]}" alt="${p.name}" style="width:44px; height:44px; object-fit:cover; border-radius:6px;">
        </td>
        <td>
          <div style="font-weight:700; color:#0A1128;">${p.name}</div>
          <div style="font-size:0.75rem; color:#64748B;">ID: ${p.id}</div>
        </td>
        <td>
          <div>${p.brand}</div>
          <div style="font-size:0.75rem; color:#D4AF37; font-weight:700; text-transform:uppercase;">${p.category}</div>
        </td>
        <td>
          <span style="font-size:0.78rem; text-transform:capitalize; background:#EFF6FF; color:#1E40AF; padding:0.2rem 0.5rem; border-radius:4px; font-weight:600;">
            ${p.gender}
          </span>
        </td>
        <td>
          <strong>Rs. ${p.price.toLocaleString()}</strong>
          ${p.originalPrice ? `<div style="font-size:0.75rem; color:#94A3B8; text-decoration:line-through;">Rs. ${p.originalPrice.toLocaleString()}</div>` : ''}
        </td>
        <td>
          <span style="color:${p.stock > 5 ? '#10B981' : '#EF4444'}; font-weight:700;">${p.stock}</span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button onclick="window.app.openEditProductModal('${p.id}')" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.6rem;" title="Edit Product">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button onclick="window.app.handleDeleteProduct('${p.id}')" class="btn btn-dark btn-sm" style="padding:0.25rem 0.6rem; color:#EF4444;" title="Delete Product">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  openAddProductModal() {
    document.getElementById('admin-modal-title').textContent = 'Add New Cosmetic Product';
    document.getElementById('product-admin-form').reset();
    document.getElementById('admin-prod-id').value = '';
    document.getElementById('product-admin-modal').classList.add('active');
  }

  openEditProductModal(productId) {
    const p = window.store.getProductById(productId);
    if (!p) return;

    document.getElementById('admin-modal-title').textContent = `Edit Product: ${p.name}`;
    document.getElementById('admin-prod-id').value = p.id;
    document.getElementById('admin-prod-name').value = p.name;
    document.getElementById('admin-prod-brand').value = p.brand;
    document.getElementById('admin-prod-gender').value = p.gender;
    document.getElementById('admin-prod-category').value = p.category;
    document.getElementById('admin-prod-subcat').value = p.subcategory || '';
    document.getElementById('admin-prod-price').value = p.price;
    document.getElementById('admin-prod-orig-price').value = p.originalPrice || '';
    document.getElementById('admin-prod-stock').value = p.stock || 10;
    document.getElementById('admin-prod-image').value = p.images[0] || '';
    document.getElementById('admin-prod-desc').value = p.description || '';

    document.getElementById('product-admin-modal').classList.add('active');
  }

  closeProductModal() {
    document.getElementById('product-admin-modal').classList.remove('active');
  }

  handleSaveProduct(form) {
    const formData = new FormData(form);
    const prodId = formData.get('productId');

    const productPayload = {
      name: formData.get('name'),
      brand: formData.get('brand') || 'SK Luxe Skin',
      gender: formData.get('gender'),
      category: formData.get('category'),
      subcategory: formData.get('subcategory') || 'Cosmetics',
      price: Number(formData.get('price')),
      originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null,
      stock: Number(formData.get('stock')) || 10,
      description: formData.get('description') || '',
      images: [formData.get('imageUrl') || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'],
      isNew: true,
      isBestSeller: false,
      isOffer: false
    };

    if (prodId) {
      window.store.updateProduct(prodId, productPayload);
      this.showToast('Product successfully updated', 'check-circle');
    } else {
      window.store.addProduct(productPayload);
      this.showToast('New product added to catalog', 'plus-circle');
    }

    this.closeProductModal();
  }

  handleDeleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product from your store?')) {
      window.store.deleteProduct(productId);
      this.showToast('Product deleted from catalog', 'trash');
    }
  }

  renderAdminCoupons() {
    const coupons = window.store.getCoupons();
    const tbody = document.getElementById('admin-coupons-table-body');
    if (!tbody) return;

    tbody.innerHTML = coupons.map(c => `
      <tr>
        <td><strong style="color:#D4AF37;">${c.code}</strong></td>
        <td>${c.discountType}</td>
        <td>${c.discountType === 'percentage' ? c.discountValue + '%' : 'Rs. ' + c.discountValue}</td>
        <td>Rs. ${c.minOrder || 0}</td>
        <td>${c.description}</td>
        <td>
          <button onclick="window.store.deleteCoupon('${c.code}')" class="btn btn-dark btn-sm" style="color:#EF4444; padding:0.25rem 0.6rem;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  openAddCouponModal() {
    const code = prompt('Enter New Coupon Code (e.g. SUMMER20):');
    if (!code) return;
    const disc = prompt('Enter Discount Percentage (e.g. 20):');
    if (!disc) return;

    window.store.addCoupon({
      code: code.trim().toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(disc),
      minOrder: 1500,
      description: `${disc}% off orders over Rs. 1,500`
    });
    this.showToast(`Coupon ${code} created`, 'ticket');
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, icon = 'check-circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-${icon}" style="color:#D4AF37; font-size:1.15rem;"></i>
      <span style="font-size:0.88rem; font-weight:600;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

// Instantiate application
window.app = new AppController();
