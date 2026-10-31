/**
 * SK.SHOP.PK - State Management & Storage Engine with Supabase Backend
 * Handles Products, Cart, Wishlist, Orders, Coupons, Reviews, Admin Auth
 * Supabase Project: bkdammlmnxplntobphzl
 * Supabase URL: https://bkdammlmnxplntobphzl.supabase.co
 */

const SUPABASE_CONFIG = {
  url: 'https://bkdammlmnxplntobphzl.supabase.co',
  anonKey: 'sb_publishable_cvQk_pRxYkHt8F_edOzTNw_RDPQ6MyQ'
};

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
    this.supabase = null;
    this.initSupabase();
    this.init();
  }

  initSupabase() {
    try {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('[Supabase] Initialized successfully with project bkdammlmnxplntobphzl');
      }
    } catch (e) {
      console.warn('[Supabase] Client init error:', e);
    }
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

    // Attempt background sync from Supabase database
    this.syncFromSupabase();
  }

  // --- SUPABASE BACKGROUND SYNC ---
  async syncFromSupabase() {
    if (!this.supabase) return;

    try {
      // 1. Sync Products
      const { data: prods, error: pErr } = await this.supabase
        .from('products')
        .select('*');

      if (!pErr && prods && prods.length > 0) {
        const formattedProds = prods.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand || 'SK Luxe Skin',
          gender: p.gender,
          category: p.category,
          subcategory: p.subcategory,
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : null,
          rating: Number(p.rating || 4.9),
          reviewCount: p.review_count || 10,
          isNew: Boolean(p.is_new),
          isBestSeller: Boolean(p.is_bestseller),
          isOffer: Boolean(p.is_offer),
          stock: Number(p.stock || 20),
          images: Array.isArray(p.images) ? p.images : [],
          description: p.description || '',
          specs: p.specs || {},
          variants: Array.isArray(p.variants) ? p.variants : [],
          reviews: Array.isArray(p.reviews) ? p.reviews : []
        }));
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(formattedProds));
        this.notify('products_updated', formattedProds);
        console.log(`[Supabase] Synced ${formattedProds.length} products from database`);
      }

      // 2. Sync Orders
      const { data: ords, error: oErr } = await this.supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!oErr && ords && ords.length > 0) {
        const formattedOrders = ords.map(o => ({
          id: o.id,
          date: o.created_at,
          customerName: o.customer_name,
          phone: o.phone,
          whatsapp: o.whatsapp,
          address: o.address,
          city: o.city,
          postalCode: o.postal_code || 'N/A',
          notes: o.notes || '',
          items: Array.isArray(o.items) ? o.items : [],
          subtotal: Number(o.subtotal),
          discount: Number(o.discount || 0),
          couponCode: o.coupon_code || '',
          shipping: Number(o.shipping || 0),
          total: Number(o.total),
          paymentMethod: o.payment_method || 'Cash on Delivery (COD)',
          status: o.status || 'Pending',
          trackingNumber: o.tracking_number || ''
        }));
        localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(formattedOrders));
        this.notify('orders_updated', formattedOrders);
        console.log(`[Supabase] Synced ${formattedOrders.length} orders from database`);
      }

      // 3. Sync Coupons
      const { data: coups, error: cErr } = await this.supabase
        .from('coupons')
        .select('*');

      if (!cErr && coups && coups.length > 0) {
        const formattedCoupons = coups.map(c => ({
          code: c.code,
          discountType: c.discount_type,
          discountValue: Number(c.discount_value),
          minOrder: Number(c.min_order || 0),
          description: c.description || ''
        }));
        localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(formattedCoupons));
        this.notify('coupons_updated', formattedCoupons);
      }
    } catch (e) {
      console.info('[Supabase] Waiting for SQL schema execution in Supabase Console:', e.message);
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

  async addProduct(product) {
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

    // Sync to Supabase
    if (this.supabase) {
      try {
        await this.supabase.from('products').insert([{
          id: newProd.id,
          name: newProd.name,
          brand: newProd.brand,
          gender: newProd.gender,
          category: newProd.category,
          subcategory: newProd.subcategory,
          price: newProd.price,
          original_price: newProd.originalPrice,
          rating: newProd.rating,
          review_count: newProd.reviewCount,
          is_new: newProd.isNew,
          is_bestseller: newProd.isBestSeller,
          is_offer: newProd.isOffer,
          stock: newProd.stock,
          images: newProd.images,
          description: newProd.description,
          specs: newProd.specs || {},
          variants: newProd.variants || [],
          reviews: newProd.reviews || []
        }]);
      } catch (e) {
        console.warn('Supabase addProduct sync error:', e);
      }
    }

    return newProd;
  }

  async updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedFields };
      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.notify('products_updated', products);

      // Sync to Supabase
      if (this.supabase) {
        try {
          const mapped = {};
          if (updatedFields.name !== undefined) mapped.name = updatedFields.name;
          if (updatedFields.brand !== undefined) mapped.brand = updatedFields.brand;
          if (updatedFields.gender !== undefined) mapped.gender = updatedFields.gender;
          if (updatedFields.category !== undefined) mapped.category = updatedFields.category;
          if (updatedFields.subcategory !== undefined) mapped.subcategory = updatedFields.subcategory;
          if (updatedFields.price !== undefined) mapped.price = updatedFields.price;
          if (updatedFields.originalPrice !== undefined) mapped.original_price = updatedFields.originalPrice;
          if (updatedFields.stock !== undefined) mapped.stock = updatedFields.stock;
          if (updatedFields.description !== undefined) mapped.description = updatedFields.description;
          if (updatedFields.images !== undefined) mapped.images = updatedFields.images;

          await this.supabase.from('products').update(mapped).eq('id', id);
        } catch (e) {
          console.warn('Supabase updateProduct sync error:', e);
        }
      }

      return products[idx];
    }
    return null;
  }

  async deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify('products_updated', products);

    // Sync to Supabase
    if (this.supabase) {
      try {
        await this.supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteProduct sync error:', e);
      }
    }

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

  // --- ORDERS & SUPABASE PERSISTENCE ---
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

    // Update stock levels
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

    // Save to Supabase Cloud Database asynchronously
    if (this.supabase) {
      this.supabase.from('orders').insert([{
        id: newOrder.id,
        customer_name: newOrder.customerName,
        phone: newOrder.phone,
        whatsapp: newOrder.whatsapp,
        address: newOrder.address,
        city: newOrder.city,
        postal_code: newOrder.postalCode,
        notes: newOrder.notes,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        coupon_code: newOrder.couponCode,
        shipping: newOrder.shipping,
        total: newOrder.total,
        payment_method: newOrder.paymentMethod,
        status: newOrder.status,
        tracking_number: newOrder.trackingNumber
      }]).then(({ data, error }) => {
        if (error) console.warn('[Supabase] Order insert notice:', error.message);
        else console.log('[Supabase] Order saved successfully to cloud:', newOrder.id);
      }).catch(err => console.warn('[Supabase] Order sync skipped:', err));
    }

    return newOrder;
  }

  async updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = newStatus;
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify('orders_updated', orders);

      // Sync to Supabase
      if (this.supabase) {
        try {
          await this.supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        } catch (e) {
          console.warn('Supabase updateOrderStatus sync error:', e);
        }
      }

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

  async addCoupon(coupon) {
    const coupons = this.getCoupons();
    const code = coupon.code.trim().toUpperCase();
    if (coupons.some(c => c.code === code)) {
      return { success: false, message: 'Coupon code already exists.' };
    }
    const newCoupon = {
      code,
      discountType: coupon.discountType || 'percentage',
      discountValue: Number(coupon.discountValue),
      minOrder: Number(coupon.minOrder) || 0,
      description: coupon.description || ''
    };
    coupons.push(newCoupon);
    localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.notify('coupons_updated', coupons);

    // Sync to Supabase
    if (this.supabase) {
      try {
        await this.supabase.from('coupons').insert([{
          code: newCoupon.code,
          discount_type: newCoupon.discountType,
          discount_value: newCoupon.discountValue,
          min_order: newCoupon.minOrder,
          description: newCoupon.description
        }]);
      } catch (e) {
        console.warn('Supabase addCoupon sync error:', e);
      }
    }

    return { success: true };
  }

  async deleteCoupon(code) {
    let coupons = this.getCoupons();
    coupons = coupons.filter(c => c.code !== code);
    localStorage.setItem(this.STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.notify('coupons_updated', coupons);

    // Sync to Supabase
    if (this.supabase) {
      try {
        await this.supabase.from('coupons').delete().eq('code', code);
      } catch (e) {
        console.warn('Supabase deleteCoupon sync error:', e);
      }
    }
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

      // Sync to Supabase
      if (this.supabase) {
        this.supabase.from('products').update({
          rating: prod.rating,
          review_count: prod.reviewCount,
          reviews: prod.reviews
        }).eq('id', productId).catch(err => console.warn(err));
      }

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
