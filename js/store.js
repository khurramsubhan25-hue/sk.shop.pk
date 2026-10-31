/**
 * SK.SHOP.PK - State Management & Storage Engine
 * Handles Products, Cart, Wishlist, Orders, Coupons, Reviews, Admin Auth
 */

class StoreEngine {
  constructor() {
    this.STORAGE_KEYS = {
      PRODUCTS: 'sk_shop_products_v1',
      CART: 'sk_shop_cart_v1',
      WISHLIST: 'sk_shop_wishlist_v1',
      ORDERS: 'sk_shop_orders_v1',
      COUPONS: 'sk_shop_coupons_v1',
      RECENT: 'sk_shop_recent_v1',
      ADMIN_AUTH: 'sk_shop_admin_session_v1'
    };
    this.listeners = new Map();
    this.init();
  }

  init() {
    // Initialize products if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    // Initialize orders if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    // Initialize coupons if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.COUPONS)) {
      localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    }
    // Initialize cart if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.CART)) {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    }
    // Initialize wishlist if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.WISHLIST)) {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify([]));
    }
    // Initialize recent if not present
    if (!localStorage.getItem(this.STORAGE_KEYS.RECENT)) {
      localStorage.setItem(this.STORAGE_KEYS.RECENT, JSON.stringify([]));
    }
  }

  // --- PUB/SUB ---
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const list = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, list);
    };
  }

  notify(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try { cb(payload); } catch (e) { console.error('Store listener error:', e); }
      });
    }
  }

  // --- PRODUCTS ---
  getProducts() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  addProduct(product) {
    const products = this.getProducts();
    const newId = 'sk-' + Date.now().toString(36);
    const newProd = {
      ...product,
      id: newId,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      reviews: product.reviews || []
    };
    products.unshift(newProd);
    localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify('products_updated', products);
    return newProd;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedFields };
      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify('products_updated', products);
      return products[idx];
    }
    return null;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify('products_updated', products);
    return true;
  }

  resetProductsToDefault() {
    localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    this.notify('products_updated', INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  // --- CART ---
  getCart() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  addToCart(productId, variantName = null, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;

    let cart = this.getCart();
    let variant = null;
    let price = product.price;

    if (product.variants && product.variants.length > 0) {
      if (variantName) {
        variant = product.variants.find(v => v.name === variantName) || product.variants[0];
      } else {
        variant = product.variants[0];
      }
      price = variant.price || product.price;
    }

    const cartItemId = `${productId}_${variant ? variant.name : 'default'}`;
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        cartItemId,
        productId,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || 'assets/logo.jpg',
        price: price,
        originalPrice: product.originalPrice,
        variantName: variant ? variant.name : null,
        quantity: quantity,
        stock: product.stock
      });
    }

    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart_updated', cart);
    return true;
  }

  updateCartQuantity(cartItemId, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => item.cartItemId !== cartItemId);
    } else {
      const item = cart.find(i => i.cartItemId === cartItemId);
      if (item) {
        item.quantity = newQty;
      }
    }
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart_updated', cart);
  }

  removeFromCart(cartItemId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart_updated', cart);
  }

  clearCart() {
    localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify([]));
    this.notify('cart_updated', []);
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotals(couponCode = '') {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = subtotal >= STORE_CONFIG.freeShippingThreshold || subtotal === 0 ? 0 : STORE_CONFIG.standardShippingFee;
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const val = this.validateCoupon(couponCode, subtotal);
      if (val.valid) {
        appliedCoupon = val.coupon;
        if (appliedCoupon.discountType === 'percentage') {
          discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
        } else if (appliedCoupon.discountType === 'free_shipping') {
          shipping = 0;
          discount = STORE_CONFIG.standardShippingFee;
        } else if (appliedCoupon.discountType === 'fixed') {
          discount = appliedCoupon.discountValue;
        }
      }
    }

    const grandTotal = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      shipping,
      discount,
      grandTotal,
      appliedCoupon,
      freeShippingLeft: Math.max(0, STORE_CONFIG.freeShippingThreshold - subtotal)
    };
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const exists = wishlist.includes(productId);
    if (exists) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    this.notify('wishlist_updated', wishlist);
    return !exists;
  }

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  }

  getWishlistCount() {
    return this.getWishlist().length;
  }

  // --- ORDERS ---
  getOrders() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  }

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.id.toUpperCase() === orderId.toUpperCase()) || null;
  }

  trackOrder(query) {
    const q = query.trim().toUpperCase();
    const orders = this.getOrders();
    return orders.find(o => 
      o.id.toUpperCase() === q || 
      o.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '') ||
      (o.trackingNumber && o.trackingNumber.toUpperCase() === q)
    ) || null;
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    // Unique Pakistani Order ID format: SK-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SK-2026-${randomSuffix}`;

    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: orderData.customerName,
      phone: orderData.phone,
      whatsapp: orderData.whatsapp || orderData.phone,
      address: orderData.address,
      city: orderData.city,
      postalCode: orderData.postalCode || 'N/A',
      notes: orderData.notes || '',
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      couponCode: orderData.couponCode || '',
      shipping: orderData.shipping,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery (COD)',
      status: 'Pending',
      trackingNumber: `SK-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    orders.unshift(newOrder);
    localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Update stock levels for ordered items
    const products = this.getProducts();
    orderData.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, (prod.stock || 10) - item.quantity);
      }
    });
    localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Clear cart
    this.clearCart();
    this.notify('orders_updated', orders);
    this.notify('products_updated', products);

    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify('orders_updated', orders);
      return orders[idx];
    }
    return null;
  }

  // --- COUPONS ---
  getCoupons() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.COUPONS);
      return data ? JSON.parse(data) : INITIAL_COUPONS;
    } catch (e) {
      return INITIAL_COUPONS;
    }
  }

  validateCoupon(code, subtotal) {
    if (!code) return { valid: false, message: 'Please enter a coupon code.' };
    const coupons = this.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { valid: false, message: 'Invalid coupon code.' };
    }
    if (subtotal < (found.minOrder || 0)) {
      return { valid: false, message: `Minimum order of Rs. ${found.minOrder} required for coupon ${found.code}.` };
    }
    return { valid: true, coupon: found };
  }

  addCoupon(coupon) {
    const coupons = this.getCoupons();
    const code = coupon.code.trim().toUpperCase();
    if (coupons.some(c => c.code === code)) {
      return { success: false, message: 'Coupon code already exists.' };
    }
    coupons.push({
      code,
      discountType: coupon.discountType || 'percentage',
      discountValue: Number(coupon.discountValue),
      minOrder: Number(coupon.minOrder) || 0,
      description: coupon.description || ''
    });
    localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.notify('coupons_updated', coupons);
    return { success: true };
  }

  deleteCoupon(code) {
    let coupons = this.getCoupons();
    coupons = coupons.filter(c => c.code !== code);
    localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.notify('coupons_updated', coupons);
  }

  // --- REVIEWS ---
  addReview(productId, reviewData) {
    const products = this.getProducts();
    const prod = products.find(p => p.id === productId);
    if (prod) {
      if (!prod.reviews) prod.reviews = [];
      prod.reviews.unshift({
        author: reviewData.author,
        rating: Number(reviewData.rating),
        date: 'Just now',
        comment: reviewData.comment
      });
      // Recalculate average rating
      const sum = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
      prod.rating = Number((sum / prod.reviews.length).toFixed(1));
      prod.reviewCount = prod.reviews.length;

      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify('products_updated', products);
      return true;
    }
    return false;
  }

  // --- RECENTLY VIEWED ---
  addRecentlyViewed(productId) {
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.RECENT)) || [];
    } catch (e) {}
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 8) recent = recent.slice(0, 8);
    localStorage.setItem(this.STORAGE_KEYS.RECENT, JSON.stringify(recent));
  }

  getRecentlyViewed() {
    try {
      const ids = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.RECENT)) || [];
      const products = this.getProducts();
      return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  // --- ADMIN AUTH ---
  isAdminLoggedIn() {
    return sessionStorage.getItem(this.STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }

  loginAdmin(password) {
    if (password === STORE_CONFIG.adminDefaultPass) {
      sessionStorage.setItem(this.STORAGE_KEYS.ADMIN_AUTH, 'true');
      this.notify('admin_auth_changed', true);
      return true;
    }
    return false;
  }

  logoutAdmin() {
    sessionStorage.removeItem(this.STORAGE_KEYS.ADMIN_AUTH);
    this.notify('admin_auth_changed', false);
  }

  // --- ANALYTICS ---
  getAnalytics() {
    const orders = this.getOrders();
    const products = this.getProducts();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    
    // Unique customers based on phone number
    const uniquePhones = new Set(orders.map(o => o.phone.trim()));
    const totalCustomers = Math.max(uniquePhones.size, 1);

    // Best selling products count
    const productSales = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        order.items.forEach(item => {
          productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
        });
      }
    });

    const bestSellers = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      totalProducts: products.length,
      totalCustomers,
      pendingOrders,
      bestSellers
    };
  }
}

// Single instance for the app
window.store = new StoreEngine();
