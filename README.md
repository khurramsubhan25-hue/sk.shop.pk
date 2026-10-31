# SK.SHOP.PK — Luxury Beauty & Cosmetics E-Commerce

![SK.SHOP.PK Logo](assets/logo-badge.png)

Official repository for **SK.SHOP.PK**, Pakistan's premier luxury online cosmetics store featuring skincare, haircare, personal care, and luxury fragrances for both women and men.

---

## 🌟 Highlights

- **Official Brand Identity**: Luxury Navy Blue & Royal Gold aesthetic with official 3D brand logo.
- **Pakistani Market Tailored**:
  - Currency: Pakistani Rupees (`PKR / Rs.`)
  - Delivery: Free delivery above Rs. 2,999 across all cities, towns & villages in Pakistan.
  - Payment: Cash on Delivery (COD) [Default & Recommended], Bank Transfer / JazzCash / EasyPaisa.
- **Dedicated Business Support**:
  - **Phone**: [0302 3912469](tel:+923023912469)
  - **WhatsApp**: [0302 3912469](https://wa.me/923023912469)
  - Floating WhatsApp chat button with pre-filled inquiry message.
- **Product Collections**:
  - **Ladies Collection**: Radiant 24K Gold Serums, Saffron Face Creams, Hair Spa Masks, Shampoos, Lip Care.
  - **Gents Collection**: Activated Charcoal Face Wash, Beard Growth Oils, Hair Styling Pomades, Men's Sunscreen.
  - **Unisex Collection**: Imperial Cambodian Ouds, Pure Rose Water Distillates, Bath Spa Salts.
- **Customer Experience**:
  - Live instant search with autocomplete suggestions.
  - Interactive slide-over cart drawer with free delivery progress meter.
  - Quick View modal with multi-angle gallery, volume variant picker, specs, and WhatsApp order CTA.
  - Real-time Order Tracking with an interactive 5-stage courier progress bar.
- **Protected Admin Dashboard (`#admin`)**:
  - Passcode-secured portal (default: `skadmin2026`).
  - Real-time KPI analytics (Revenue in PKR, Total Orders, Catalog Products, Pending Orders).
  - Complete order management with status dropdowns & **1-click direct WhatsApp Customer Contact**.
  - Product manager (Add, Edit, Delete) & Promotional Coupon Code creator.

---

## 🚀 Running Locally

### Option 1: Native PowerShell Web Server
Run the built-in HTTP server on Windows:
```powershell
powershell -ExecutionPolicy Bypass -File "serve.ps1" -Port 8080
```
Then visit: `http://localhost:8080/`

### Option 2: Direct File Execution
Simply open `index.html` in any modern web browser (Edge, Chrome, Firefox, Safari).

---

## 📁 Repository Structure

```
sk-shop-pk/
├── index.html              # Main SPA HTML5 interface & SEO tags
├── serve.ps1               # Lightweight PowerShell .NET HTTP server
├── .gitignore              # Git ignore rules
├── assets/
│   ├── logo.jpg            # Official SK.SHOP.PK luxury logo
│   ├── logo-badge.png      # High-res navbar & footer badge
│   ├── favicon.png         # Official SK monogram browser favicon
│   └── hero-banner.jpg     # Luxury cosmetics hero banner
├── css/
│   └── style.css           # Luxury design system (Navy, Gold, Black, White)
└── js/
    ├── data.js             # Initial catalog, Pakistani cities, coupon codes
    ├── store.js            # Reactive state management with LocalStorage persistence
    └── app.js              # SPA router, UI event listeners, checkout, admin logic
```

---

## 📞 Contact Information

- **Call Us**: [0302 3912469](tel:+923023912469)
- **WhatsApp**: [0302 3912469](https://wa.me/923023912469)
- **Email**: `info@sk.shop.pk`

© 2026 **SK.SHOP.PK**. All Rights Reserved.
