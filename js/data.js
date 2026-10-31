/**
 * SK.SHOP.PK - Official Store Configuration & Product Catalog
 * Premium Beauty, Skincare, Haircare, Fragrances & Personal Care (Pakistan)
 * Official Business Contact: 0302 3912469
 */

const STORE_CONFIG = {
  brandName: 'SK.SHOP.PK',
  tagline: 'Discover Your Beauty with SK.SHOP.PK',
  subtitle: 'Your Ultimate Destination for Beauty, Skincare & Personal Care.',
  phone: '0302 3912469',
  phoneRaw: '03023912469',
  phoneIntl: '+923023912469',
  whatsappNumber: '923023912469',
  telLink: 'tel:+923023912469',
  defaultWhatsappMsg: 'Hello SK.SHOP.PK! I am interested in your cosmetics products. Please share more details.',
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.defaultWhatsappMsg)}`;
  },
  freeShippingThreshold: 2999,
  standardShippingFee: 200,
  currency: 'PKR',
  currencySymbol: 'Rs. ',
  officialEmail: 'info@sk.shop.pk',
  adminDefaultPass: 'skadmin2026'
};

const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Abbottabad',
  'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana', 'Sheikhupura', 'Rahim Yar Khan',
  'Jhang', 'Dera Ghazi Khan', 'Gujrat', 'Sahiwal', 'Wah Cantt', 'Mardan',
  'Kasur', 'Okara', 'Mingora', 'Nawabshah', 'Chiniot', 'Hafizabad',
  'Sadiqabad', 'Mirpur Khas', 'Burewala', 'Kohat', 'Khanewal', 'Dera Ismail Khan',
  'Turbat', 'Muzaffargarh', 'Mandi Bahauddin', 'Shikarpur', 'Jhelum',
  'Khanpur', 'Khairpur', 'Khuzdar', 'Pakpattan', 'Daska', 'Gojra',
  'Bahawalnagar', 'Muzaffarabad', 'Mirpur (AJK)', 'Gilgit', 'Skardu', 'Gwadar'
];

const INITIAL_COUPONS = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrder: 0, description: '10% off your entire order' },
  { code: 'SKGOLD', discountType: 'percentage', discountValue: 15, minOrder: 3500, description: '15% off on luxury orders over Rs. 3,500' },
  { code: 'FREESHIP', discountType: 'free_shipping', discountValue: 200, minOrder: 1500, description: 'Free Nationwide Courier Delivery' }
];

const INITIAL_PRODUCTS = [
  // --- LADIES SKINCARE ---
  {
    id: 'sk-001',
    name: '24K Pure Gold Radiance Glow Serum',
    brand: 'SK Luxe Skin',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Serums',
    price: 2850,
    originalPrice: 3800,
    rating: 4.9,
    reviewCount: 84,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Infused with genuine 24-karat gold flakes, hyaluronic acid, and collagen-boosting peptides. Gently revitalizes dull skin, reduces fine lines, and imparts a luminous royal bridal glow suitable for all Pakistani skin types.',
    specs: {
      volume: '30ml Glass Dropper',
      skinType: 'All Skin Types (Especially Dull & Aging Skin)',
      keyIngredients: '24K Gold Foil, Hyaluronic Acid, Niacinamide, Vitamin C',
      howToUse: 'Apply 3-4 drops onto cleansed face morning and night before moisturizing.',
      origin: 'Formulated with Premium Imported Extracts',
      expiry: '36 Months from MFG'
    },
    variants: [
      { name: '30ml Regular', price: 2850 },
      { name: '50ml Deluxe', price: 3950 }
    ],
    reviews: [
      { author: 'Ayesha K. (Lahore)', rating: 5, date: '2 days ago', comment: 'MashAllah the glow is unbelievable! Non-greasy and feels so luxury on skin.' },
      { author: 'Fatima Z. (Karachi)', rating: 5, date: '1 week ago', comment: 'Ordered via WhatsApp and received within 2 days in Karachi. 100% original!' }
    ]
  },
  {
    id: 'sk-002',
    name: 'Pure Saffron & Rose Glow Face Cream',
    brand: 'SK Herbal Organics',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Face Cream',
    price: 2200,
    originalPrice: 2900,
    rating: 4.8,
    reviewCount: 62,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Enriched with authentic Kashmiri Saffron (Zafran) and pure damask rose water. Deeply hydrates, evens skin tone, and helps fade blemishes and dark spots while providing round-the-clock softness.',
    specs: {
      volume: '50g Luxury Jar',
      skinType: 'Normal, Dry & Combination Skin',
      keyIngredients: 'Kashmiri Zafran, Organic Rose Extract, Sweet Almond Oil, Vitamin E',
      howToUse: 'Gently massage a small amount onto face and neck in upward circular motions.',
      origin: 'Handcrafted Organic Formulation',
      expiry: '24 Months'
    },
    variants: [
      { name: '50g Standard', price: 2200 },
      { name: '100g Value Tub', price: 3400 }
    ],
    reviews: [
      { author: 'Zainab N. (Islamabad)', rating: 5, date: '3 days ago', comment: 'The aroma of real saffron is divine! Leaves my skin so velvety soft.' }
    ]
  },
  {
    id: 'sk-003',
    name: 'Hydra-Plump Niacinamide & Rice Water Moisturizer',
    brand: 'DermaGlow PK',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Moisturizers',
    price: 1950,
    originalPrice: 2600,
    rating: 4.7,
    reviewCount: 45,
    isNew: true,
    isBestSeller: false,
    isOffer: true,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f413a9675bd?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Lightweight gel-cream formula combining 5% Niacinamide and fermented Korean rice water. Strengthens skin barrier, minimizes enlarged pores, and locks in 72-hour moisture without stickiness.',
    specs: {
      volume: '60ml Pump Dispenser',
      skinType: 'Oily, Combination & Sensitive Skin',
      keyIngredients: 'Niacinamide 5%, Fermented Rice Water, Ceramide-3',
      howToUse: 'Apply evenly morning and night after toner and serum.',
      origin: 'Imported Actives, Packed in PK',
      expiry: '36 Months'
    },
    variants: [
      { name: '60ml', price: 1950 }
    ],
    reviews: [
      { author: 'Mehwish B. (Faisalabad)', rating: 5, date: '5 days ago', comment: 'Best moisturizer for humid weather. Does not make my T-zone oily at all.' }
    ]
  },
  {
    id: 'sk-004',
    name: 'Tea Tree & Neem Purifying Gentle Face Wash',
    brand: 'SK Pure Balance',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Face Wash',
    price: 1450,
    originalPrice: 1850,
    rating: 4.8,
    reviewCount: 97,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b7720977a4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sulfate-free acne defense face wash with Australian Tea Tree Oil and wild Pakistani Neem leaves. Washes away excess sebum, unclogs deep pores, and eliminates acne-causing bacteria without stripping natural moisture.',
    specs: {
      volume: '150ml Tube',
      skinType: 'Acne-Prone & Oily Skin',
      keyIngredients: 'Organic Neem Extract, Melaleuca Tea Tree, Salicylic Acid 1%',
      howToUse: 'Lather onto wet hands, massage gently over face for 60 seconds, rinse thoroughly.',
      origin: 'Clinical Grade Cosmetics',
      expiry: '24 Months'
    },
    variants: [
      { name: '150ml Standard', price: 1450 },
      { name: '250ml Family Pack', price: 2150 }
    ],
    reviews: [
      { author: 'Saba R. (Rawalpindi)', rating: 5, date: '1 week ago', comment: 'Cleared my stubborn breakouts within 10 days. Very refreshing.' }
    ]
  },
  {
    id: 'sk-005',
    name: 'Ultra-Matte Invisible Sunscreen Gel SPF 60 PA+++',
    brand: 'SK SunShield Pro',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Sunscreens',
    price: 1950,
    originalPrice: 2500,
    rating: 4.9,
    reviewCount: 110,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Zero white cast, non-comedogenic broad-spectrum sun defense engineered for extreme Pakistani summer heat. Water and sweat resistant for up to 80 minutes, perfectly priming skin under makeup.',
    specs: {
      volume: '50ml Airless Tube',
      skinType: 'All Skin Types (Safe for Sensitive Skin)',
      keyIngredients: 'Zinc Oxide, Titanium Dioxide, Hyaluronic Acid, Vitamin E',
      howToUse: 'Apply generously 15 minutes before sun exposure. Reapply every 2-3 hours.',
      origin: 'Dermatologist Tested Formula',
      expiry: '36 Months'
    },
    variants: [
      { name: '50ml', price: 1950 }
    ],
    reviews: [
      { author: 'Dr. Rabia H. (Karachi)', rating: 5, date: '4 days ago', comment: 'Zero white cast! Sits beautifully under makeup. Highly recommended.' }
    ]
  },

  // --- LADIES HAIRCARE ---
  {
    id: 'hr-001',
    name: 'Moroccan Argan Liquid Gold Hair Oil',
    brand: 'SK Hair Luxe',
    gender: 'ladies',
    category: 'haircare',
    subcategory: 'Hair Oils',
    price: 2400,
    originalPrice: 3200,
    rating: 4.9,
    reviewCount: 78,
    isNew: false,
    isBestSeller: true,
    isOffer: true,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure cold-pressed Moroccan Argan Oil infused with sweet almond and jojoba oils. Tames intense frizz, repairs split ends, shields against heat styling damage, and delivers mirror-like shine.',
    specs: {
      volume: '100ml Luxury Glass Bottle',
      hairType: 'Frizzy, Dry, Damaged & Color-Treated Hair',
      keyIngredients: '100% Pure Moroccan Argan Oil, Jojoba Oil, Vitamin E',
      howToUse: 'Pump 2-3 drops into palms and work through damp or dry hair lengths.',
      origin: 'Moroccan Imported Argan',
      expiry: '36 Months'
    },
    variants: [
      { name: '100ml Standard', price: 2400 },
      { name: '200ml Jumbo', price: 3800 }
    ],
    reviews: [
      { author: 'Hira S. (Multan)', rating: 5, date: '1 week ago', comment: 'My frizzy curls became so sleek and shiny! Love the royal packaging.' }
    ]
  },
  {
    id: 'hr-002',
    name: 'Biotin & Keratin Anti-Hairfall Repair Shampoo',
    brand: 'SK Hair Luxe',
    gender: 'ladies',
    category: 'haircare',
    subcategory: 'Shampoos',
    price: 1850,
    originalPrice: 2400,
    rating: 4.8,
    reviewCount: 92,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sulfate and paraben-free therapeutic shampoo enriched with active Biotin (B7) and micro-keratin proteins. Dramatically reduces hair breakage, stimulates follicles, and thickens hair density.',
    specs: {
      volume: '300ml Pump Bottle',
      hairType: 'Thinning, Weak & Hairfall-Prone Hair',
      keyIngredients: 'Pure Biotin, Hydrolyzed Keratin, Caffeine, Pro-Vitamin B5',
      howToUse: 'Massage into scalp and wet hair for 2-3 minutes, rinse thoroughly.',
      origin: 'Botanical Active Infusion',
      expiry: '36 Months'
    },
    variants: [
      { name: '300ml', price: 1850 },
      { name: '500ml Salon Size', price: 2750 }
    ],
    reviews: [
      { author: 'Samina P. (Peshawar)', rating: 5, date: '2 weeks ago', comment: 'Hairfall reduced by 80% after 3 washes. Will definitely order again.' }
    ]
  },
  {
    id: 'hr-003',
    name: 'Intensive Collagen & Shea Butter Hair Spa Mask',
    brand: 'SK Hair Luxe',
    gender: 'ladies',
    category: 'haircare',
    subcategory: 'Hair Masks',
    price: 2650,
    originalPrice: 3500,
    rating: 4.9,
    reviewCount: 54,
    isNew: true,
    isBestSeller: false,
    isOffer: true,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Deep conditioning salon-grade treatment mask. Penetrates hair cuticles to rebuild keratin bonds damaged by heat styling, rebonding, and chemical treatments.',
    specs: {
      volume: '250g Jar',
      hairType: 'Severely Damaged & Chemically Treated Hair',
      keyIngredients: 'Marine Collagen, Raw African Shea Butter, D-Panthenol',
      howToUse: 'After shampooing, apply generously to hair mid-lengths and ends. Leave on 10-15 minutes, then rinse.',
      origin: 'Salon Professional',
      expiry: '24 Months'
    },
    variants: [
      { name: '250g Standard', price: 2650 }
    ],
    reviews: [
      { author: 'Anam M. (Sialkot)', rating: 5, date: '3 days ago', comment: 'Better than expensive keratin salon treatments. Softness lasts days!' }
    ]
  },
  {
    id: 'hr-004',
    name: 'Rosemary & Onion Active Scalp Growth Elixir',
    brand: 'Botanica PK',
    gender: 'ladies',
    category: 'haircare',
    subcategory: 'Hair Treatments',
    price: 2100,
    originalPrice: 2800,
    rating: 4.8,
    reviewCount: 65,
    isNew: true,
    isBestSeller: true,
    isOffer: false,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% natural, odor-free active scalp tonic formulated with pure rosemary essential oil and red onion sulfur extract. Re-activates dormant hair follicles and promotes rapid baby hair regrowth.',
    specs: {
      volume: '60ml Dropper',
      hairType: 'Alopecia, Thinning Crown & Receding Hairline',
      keyIngredients: 'Rosmarinus Officinalis, Red Onion Extract, Peppermint Oil',
      howToUse: 'Dispense dropper onto problem scalp areas every night and gently massage for 5 minutes.',
      origin: 'Organic Ayurvedic Standard',
      expiry: '24 Months'
    },
    variants: [
      { name: '60ml', price: 2100 }
    ],
    reviews: [
      { author: 'Nadia Q. (Quetta)', rating: 5, date: '1 month ago', comment: 'Saw new baby hair growth in just 4 weeks! Genuine product.' }
    ]
  },

  // --- LADIES BODY & PERFUMES & MAKEUP ---
  {
    id: 'fr-001',
    name: 'Royal Jasmine & White Musk Eau De Parfum 100ml',
    brand: 'SK Haute Parfumerie',
    gender: 'ladies',
    category: 'fragrances',
    subcategory: 'Perfumes',
    price: 4500,
    originalPrice: 5900,
    rating: 5.0,
    reviewCount: 112,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An enchanting luxury floral-oriental fragrance opening with sparkling bergamot and royal Sambac jasmine, settled on a warm, sensual base of French vanilla and velvety white musk. Exceptional 12+ hour sillage.',
    specs: {
      volume: '100ml Heavy Crystal Bottle with Gold Crown Cap',
      concentration: 'Eau De Parfum (25% Oil Concentration)',
      topNotes: 'Italian Bergamot, Pink Pepper',
      heartNotes: 'Royal Sambac Jasmine, Damask Rose',
      baseNotes: 'White Musk, Warm Amber, Madagascar Vanilla',
      origin: 'French Essential Oils, Blended for Pakistan Climate',
      expiry: '60 Months'
    },
    variants: [
      { name: '50ml Travel', price: 2950 },
      { name: '100ml Full Size', price: 4500 }
    ],
    reviews: [
      { author: 'Kiran W. (Lahore Cantt)', rating: 5, date: 'Yesterday', comment: 'Smells like high-end designer perfumes! Lasted all day in Lahore weather.' },
      { author: 'Bushra T. (Islamabad)', rating: 5, date: '5 days ago', comment: 'The packaging with royal gold details is breathtaking. Perfect gift.' }
    ]
  },
  {
    id: 'bd-001',
    name: 'Velvet Silk Shea & Almond Nourishing Body Lotion',
    brand: 'SK Body Luxuries',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Body Lotions',
    price: 1650,
    originalPrice: 2100,
    rating: 4.8,
    reviewCount: 48,
    isNew: false,
    isBestSeller: false,
    isOffer: false,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rich, fast-absorbing body milk infused with organic shea butter and sweet almond oil. Deeply rehydrates dry skin, restores natural suppleness, and leaves a delicate luxury scent.',
    specs: {
      volume: '350ml Dispenser',
      skinType: 'Dry to Very Dry Skin',
      keyIngredients: 'Raw Shea Butter, Sweet Almond Milk, Vitamin E',
      howToUse: 'Smooth generously over entire body daily after showering.',
      origin: 'Dermatologically Approved',
      expiry: '36 Months'
    },
    variants: [
      { name: '350ml', price: 1650 }
    ],
    reviews: [
      { author: 'Sadia E. (Gujranwala)', rating: 5, date: '1 week ago', comment: 'Leaves skin feeling like pure silk! Smells heavenly.' }
    ]
  },
  {
    id: 'mk-001',
    name: 'Velvet Matte Longstay Waterproof Lipstick Trio',
    brand: 'SK Glamour',
    gender: 'ladies',
    category: 'makeup',
    subcategory: 'Lip Care',
    price: 2350,
    originalPrice: 3100,
    rating: 4.9,
    reviewCount: 88,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Set of 3 bestselling Pakistani wedding shades: Royal Crimson, Nude Chai, and Dusty Mauve. Ultra-pigmented, transfer-proof, smudge-free formula that stays vibrant for up to 16 hours without drying lips.',
    specs: {
      volume: '3 x 5ml Tubes with Gold Detailing',
      finish: 'Comfortable Velvet Matte',
      features: 'Waterproof, Transfer-Resistant, Paraben-Free',
      origin: 'Cruelty-Free International Standards',
      expiry: '36 Months'
    },
    variants: [
      { name: 'Trio Set (3 Shades)', price: 2350 }
    ],
    reviews: [
      { author: 'Iqra J. (Hyderabad)', rating: 5, date: '3 days ago', comment: 'Nude Chai is the best everyday nude shade I have ever worn in Pakistan!' }
    ]
  },
  {
    id: 'sk-006',
    name: 'Intensive Whitening Hand & Foot Care Balm',
    brand: 'SK Care Specialists',
    gender: 'ladies',
    category: 'skincare',
    subcategory: 'Hand & Foot Care',
    price: 1350,
    originalPrice: 1750,
    rating: 4.7,
    reviewCount: 59,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Targeted corrective formula with AHA fruit acids, urea, and cocoa butter to heal cracked heels, soften rough knuckles, and brighten sun-tanned hands and feet.',
    specs: {
      volume: '100g Tub',
      skinType: 'Rough, Darkened & Cracked Skin',
      keyIngredients: 'Lactic Acid, 10% Urea, Pure Beeswax, Cocoa Butter',
      howToUse: 'Apply generously to hands and feet before bed. Wear cotton socks for best results.',
      origin: 'Pharmaceutical Grade Cosmetics',
      expiry: '24 Months'
    },
    variants: [
      { name: '100g', price: 1350 }
    ],
    reviews: [
      { author: 'Farzana B. (Sargodha)', rating: 5, date: '6 days ago', comment: 'Healed my dry cracked heels in just 4 days. Very impressed.' }
    ]
  },

  // --- GENTS COLLECTION ---
  {
    id: 'gt-001',
    name: "Men's Activated Charcoal Oil-Clear Face Wash",
    brand: 'SK Man Pro Grooming',
    gender: 'gents',
    category: 'skincare',
    subcategory: "Men's Face Wash",
    price: 1400,
    originalPrice: 1800,
    rating: 4.8,
    reviewCount: 94,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b7720977a4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Formulated specifically for Pakistani men facing daily traffic dust, smoke, and sweat. Activated bamboo charcoal draws out deep pollution impurities, unclogs pores, and prevents blackheads with an icy cooling blast.',
    specs: {
      volume: '150ml Tube',
      skinType: "Men's Oily, Tough & Pollution-Exposed Skin",
      keyIngredients: 'Activated Bamboo Charcoal, Menthol, Salicylic Acid, Tea Tree',
      howToUse: 'Wet face, squeeze coin-sized amount, lather and massage for 1 minute, rinse off with cold water.',
      origin: 'Engineered for Men',
      expiry: '36 Months'
    },
    variants: [
      { name: '150ml', price: 1400 },
      { name: '250ml Gym Pack', price: 2100 }
    ],
    reviews: [
      { author: 'Hamza A. (Lahore)', rating: 5, date: '2 days ago', comment: 'Instant fresh cooling feeling! Removes all oil after biking through Lahore traffic.' },
      { author: 'Usman S. (Karachi)', rating: 5, date: '1 week ago', comment: 'Great product and quick COD delivery. Highly recommend for guys.' }
    ]
  },
  {
    id: 'gt-002',
    name: 'Royal Oud & Cedarwood Beard Growth & Conditioning Oil',
    brand: 'SK Man Pro Grooming',
    gender: 'gents',
    category: 'grooming',
    subcategory: 'Beard Oils',
    price: 1950,
    originalPrice: 2600,
    rating: 4.9,
    reviewCount: 125,
    isNew: false,
    isBestSeller: true,
    isOffer: true,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pakistan’s favorite beard elixir. Combines cold-pressed Moroccan Argan, Jojoba, and Castor oils scented with regal Arabian Oud and Texas Cedarwood. Fills in patchy beards, stops beard itch and dandruff, and leaves a majestic manly scent.',
    specs: {
      volume: '50ml Amber Glass Dropper',
      beardType: 'Patchy, Stiff, Itchy & Growing Beards',
      keyIngredients: 'Pure Oud Extract, Jamaican Black Castor Oil, Vitamin E, Cedarwood',
      howToUse: 'Apply 4-6 drops into palms, rub and massage deep into beard and underlying skin.',
      origin: '100% Organic Cold Pressed',
      expiry: '36 Months'
    },
    variants: [
      { name: '50ml', price: 1950 }
    ],
    reviews: [
      { author: 'Bilal M. (Islamabad)', rating: 5, date: '3 days ago', comment: 'The oud scent is luxurious and not overpowering. Softens coarse beard immediately.' }
    ]
  },
  {
    id: 'gt-003',
    name: 'Midnight Sovereign Men’s Extrait De Parfum 100ml',
    brand: 'SK Private Blend',
    gender: 'gents',
    category: 'fragrances',
    subcategory: "Men's Perfumes",
    price: 4800,
    originalPrice: 6200,
    rating: 5.0,
    reviewCount: 140,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A dark, charismatic fragrance designed for the discerning gentleman. Opens with sharp pink pepper and Calabrian bergamot, evolving into smoky incense, rich leather, and a deep base of rare Cambodian Oud and tonka bean.',
    specs: {
      volume: '100ml Heavy Black & Gold Flask',
      concentration: 'Extrait De Parfum (30% High Oil Content)',
      topNotes: 'Calabrian Bergamot, Pink Pepper, Cardamom',
      heartNotes: 'Smoky Incense, Leather, Black Rose',
      baseNotes: 'Cambodian Oud, Indonesian Patchouli, Tonka Bean',
      origin: 'Imported French & Arabian Oils',
      expiry: '60 Months'
    },
    variants: [
      { name: '50ml Pocket Flask', price: 3100 },
      { name: '100ml Luxury Box', price: 4800 }
    ],
    reviews: [
      { author: 'Capt. Tariq N. (Rawalpindi)', rating: 5, date: 'Yesterday', comment: 'Projects for 10 hours effortlessly. Got countless compliments at an event.' }
    ]
  },
  {
    id: 'gt-004',
    name: "Men's Anti-Pollution Matte Sunscreen SPF 50",
    brand: 'SK Man Pro Grooming',
    gender: 'gents',
    category: 'skincare',
    subcategory: "Men's Sunscreen",
    price: 1750,
    originalPrice: 2300,
    rating: 4.8,
    reviewCount: 51,
    isNew: true,
    isBestSeller: false,
    isOffer: false,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Non-greasy, invisible sun protection specifically formulated for men. Absorbs instantaneously, leaves no white cast over beard stubble, and resists heavy sweat during workouts or commutes.',
    specs: {
      volume: '75ml Squeeze Tube',
      skinType: 'All Men Skin Types',
      keyIngredients: 'Broad-Spectrum UV Filters, Niacinamide, Green Tea Extract',
      howToUse: 'Apply onto exposed face and neck 15 minutes before stepping outdoors.',
      origin: 'Sports & Tactical Grade Formulation',
      expiry: '36 Months'
    },
    variants: [
      { name: '75ml', price: 1750 }
    ],
    reviews: [
      { author: 'Adeel F. (Faisalabad)', rating: 5, date: '1 week ago', comment: 'Doesn’t get trapped in my stubble and doesn’t burn the eyes when sweating.' }
    ]
  },
  {
    id: 'gt-005',
    name: "Men's Strong Hold Matte Clay Hair Pomade",
    brand: 'SK Man Pro Grooming',
    gender: 'gents',
    category: 'haircare',
    subcategory: "Men's Hair Styling Products",
    price: 1600,
    originalPrice: 2100,
    rating: 4.7,
    reviewCount: 68,
    isNew: false,
    isBestSeller: false,
    isOffer: false,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Natural clay and beeswax formulation providing all-day re-workable stronghold with zero greasy shine. Rinses out effortlessly with warm water in one wash without pulling hair.',
    specs: {
      volume: '100g Matte Tin',
      holdLevel: 'Strong Hold / Natural Matte Finish',
      keyIngredients: 'Bentonite Clay, Beeswax, Argan Oil, Sandalwood Essential Oil',
      howToUse: 'Rub thumbnail-sized scoop between palms to warm up, then style dry or damp hair.',
      origin: 'Barbershop Grade',
      expiry: '24 Months'
    },
    variants: [
      { name: '100g', price: 1600 }
    ],
    reviews: [
      { author: 'Omer K. (Lahore)', rating: 5, date: '5 days ago', comment: 'Stays in place all day even in hot weather. Perfect texture.' }
    ]
  },
  {
    id: 'gt-006',
    name: 'Caffeine & Biotin Men’s Hair Follicle Thickening Shampoo',
    brand: 'SK Man Pro Grooming',
    gender: 'gents',
    category: 'haircare',
    subcategory: "Men's Shampoos",
    price: 1800,
    originalPrice: 2350,
    rating: 4.8,
    reviewCount: 77,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Energizing scalp stimulant shampoo packed with concentrated caffeine, saw palmetto, and biotin. Blocks DHT to counter male pattern hair thinning and strengthens weak roots.',
    specs: {
      volume: '250ml Matte Black Bottle',
      hairType: 'Thinning Hair & Receding Hairlines',
      keyIngredients: 'Anhydrous Caffeine, Saw Palmetto, Biotin, Menthol',
      howToUse: 'Leave lather on scalp for at least 2 minutes so caffeine can penetrate hair roots before rinsing.',
      origin: 'Clinical Hair Science',
      expiry: '36 Months'
    },
    variants: [
      { name: '250ml', price: 1800 }
    ],
    reviews: [
      { author: 'Shahid Z. (Multan)', rating: 5, date: '2 weeks ago', comment: 'Definitely noticed less hair on my pillow after 2 weeks of use.' }
    ]
  },

  // --- UNISEX COLLECTION ---
  {
    id: 'un-001',
    name: 'Imperial Royal Amber & Oud Extrait 100ml',
    brand: 'SK Private Blend',
    gender: 'unisex',
    category: 'fragrances',
    subcategory: 'Fragrances',
    price: 5800,
    originalPrice: 7500,
    rating: 5.0,
    reviewCount: 165,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Our crown jewel unisex fragrance. Crafted with aged Cambodian Agarwood, golden warm amber, Taif rose, and precious saffron. Loved equally by men and women who appreciate opulent oriental perfumery.',
    specs: {
      volume: '100ml Royal Crystal Decanter with Gold Neck',
      concentration: 'Extrait De Parfum (32% Pure Fragrance Oils)',
      scentFamily: 'Oriental Woody Amber',
      sillage: 'Colossal (14+ Hours Projection)',
      origin: 'Handmade Luxury Perfumery',
      expiry: '60 Months'
    },
    variants: [
      { name: '50ml', price: 3600 },
      { name: '100ml Crown Edition', price: 5800 }
    ],
    reviews: [
      { author: 'Malik Jahangir (Islamabad)', rating: 5, date: '3 days ago', comment: 'The finest Oud fragrance in Pakistan at this price point. Remarkable longevity!' },
      { author: 'Dr. Samreen A. (Karachi)', rating: 5, date: '1 week ago', comment: 'Both my husband and I wear this. Everyone asks us where we bought it!' }
    ]
  },
  {
    id: 'un-002',
    name: '100% Pure Organic Cold-Pressed Castor Oil',
    brand: 'Botanica PK',
    gender: 'unisex',
    category: 'haircare',
    subcategory: 'Haircare',
    price: 1200,
    originalPrice: 1550,
    rating: 4.8,
    reviewCount: 88,
    isNew: false,
    isBestSeller: false,
    isOffer: false,
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unrefined, hexane-free castor oil for thicker eyebrows, longer eyelashes, and dense beard and scalp growth. 100% virgin cold-pressed extraction with natural ricinoleic acid.',
    specs: {
      volume: '120ml Dark Glass Bottle with Spoolie Brush',
      features: 'Hexane-Free, Virgin Grade, Cold-Pressed',
      usage: 'Brows, Lashes, Scalp & Beard Growth',
      origin: 'Locally Sourced Pure Harvest',
      expiry: '36 Months'
    },
    variants: [
      { name: '120ml Bottle', price: 1200 }
    ],
    reviews: [
      { author: 'Amna G. (Gujrat)', rating: 5, date: '1 week ago', comment: 'Eyebrows got visibly thicker in 3 weeks. Very pure quality.' }
    ]
  },
  {
    id: 'un-003',
    name: 'Pure Damask Rose Water Distillate (Arq-e-Gulab) 200ml',
    brand: 'SK Herbal Organics',
    gender: 'unisex',
    category: 'skincare',
    subcategory: 'Skincare',
    price: 950,
    originalPrice: 1250,
    rating: 4.9,
    reviewCount: 130,
    isNew: false,
    isBestSeller: true,
    isOffer: false,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Triple-steam distilled from wild Punjab Rosa Damascena petals. Pure natural toner and refreshing mist without added alcohol, artificial fragrance, or preservatives. Instantly balances pH and tightens pores.',
    specs: {
      volume: '200ml Ultra-Fine Mist Spray',
      skinType: 'All Skin Types (Safe for Eyes & Sensitive Skin)',
      keyIngredients: '100% Steam-Distilled Rose Water',
      howToUse: 'Mist directly over face throughout the day to refresh, hydrate, and set makeup.',
      origin: 'Traditional Pure Distillation',
      expiry: '24 Months'
    },
    variants: [
      { name: '200ml Spray', price: 950 },
      { name: '500ml Refill', price: 1700 }
    ],
    reviews: [
      { author: 'Sumbul M. (Lahore)', rating: 5, date: '4 days ago', comment: 'The finest Arq-e-Gulab in Pakistan! Smells like fresh morning roses.' }
    ]
  },
  {
    id: 'un-004',
    name: 'Himalayan Pink Salt & Wild Honey Body Polish',
    brand: 'SK Body Luxuries',
    gender: 'unisex',
    category: 'bodycare',
    subcategory: 'Body Care',
    price: 1850,
    originalPrice: 2400,
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isBestSeller: false,
    isOffer: true,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Authentic Khewra Himalayan mineral salts suspended in organic sidr wild honey and sweet almond oil. Sloughs away dead skin cells, softens dry elbows and knees, and stimulates micro-circulation.',
    specs: {
      volume: '300g Luxury Jar',
      skinType: 'All Skin Types',
      keyIngredients: 'Khewra Pink Salt Crystals, Organic Sidr Honey, Vitamin E',
      howToUse: 'Gently buff over wet skin in circular motions in shower, rinse with warm water.',
      origin: 'Pakistani Mineral Heritage',
      expiry: '24 Months'
    },
    variants: [
      { name: '300g Jar', price: 1850 }
    ],
    reviews: [
      { author: 'Waqas A. (Karachi)', rating: 5, date: '1 week ago', comment: 'Skin feels incredibly soft after just one shower polish.' }
    ]
  },
  {
    id: 'un-005',
    name: 'French Lavender & Vanilla Bath Essentials Set',
    brand: 'SK Body Luxuries',
    gender: 'unisex',
    category: 'bodycare',
    subcategory: 'Bath Essentials',
    price: 2650,
    originalPrice: 3400,
    rating: 4.9,
    reviewCount: 36,
    isNew: true,
    isBestSeller: false,
    isOffer: false,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Complete luxury spa relaxation package containing aromatherapy lavender bath salts, artisanal cold-process goat milk soap, and soothing lavender room/pillow mist.',
    specs: {
      setIncludes: 'Aromatherapy Bath Salt 200g + Artisanal Soap Bar 120g + Relaxing Mist 100ml',
      benefits: 'Stress Relief, Muscle Relaxation & Deep Sleep',
      origin: 'Handmade Aromatherapy',
      expiry: '24 Months'
    },
    variants: [
      { name: 'Full Spa Gift Box', price: 2650 }
    ],
    reviews: [
      { author: 'Naveed S. (Islamabad)', rating: 5, date: '2 weeks ago', comment: 'Ordered for my anniversary gift box. The presentation and smell are 10/10.' }
    ]
  }
];

const CATEGORIES_METADATA = [
  {
    id: 'ladies',
    name: 'Ladies Collection',
    tagline: 'Timeless Grace & Radiant Beauty for Pakistani Women',
    banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Face Wash', 'Face Cream', 'Moisturizers', 'Serums', 'Sunscreens', 'Hair Oils', 'Shampoos', 'Hair Masks', 'Hair Treatments', 'Body Lotions', 'Perfumes', 'Lip Care', 'Hand & Foot Care']
  },
  {
    id: 'gents',
    name: 'Gents Collection',
    tagline: "High-Performance Grooming & Sophisticated Scents for Men",
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    subcategories: ["Men's Face Wash", "Men's Face Cream", "Men's Sunscreen", "Beard Oils", "Men's Perfumes", "Men's Hair Styling Products", "Men's Shampoos", "Men's Grooming Products"]
  },
  {
    id: 'unisex',
    name: 'Unisex Collection',
    tagline: 'Pure Indulgence & Shared Luxuries for Everyone',
    banner: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Fragrances', 'Haircare', 'Skincare', 'Body Care', 'Personal Hygiene', 'Bath Essentials']
  },
  {
    id: 'skincare',
    name: 'Skincare Essentials',
    tagline: 'Clinical Purity Meets Radiant Herbal Science',
    banner: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Serums', 'Face Cream', 'Moisturizers', 'Face Wash', 'Sunscreens', 'Hand & Foot Care']
  },
  {
    id: 'haircare',
    name: 'Haircare & Scalp Solutions',
    tagline: 'Restore Lustrous Strength from Root to Tip',
    banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Hair Oils', 'Shampoos', 'Hair Masks', 'Hair Treatments', "Men's Hair Styling Products"]
  },
  {
    id: 'fragrances',
    name: 'Luxury Fragrances & Oud',
    tagline: 'Mesmerizing Arabian Ouds & French Floral Parfums',
    banner: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
    subcategories: ['Perfumes', "Men's Perfumes", 'Fragrances']
  }
];

// Initial mock orders to populate the admin dashboard with realistic Pakistani e-commerce records
const INITIAL_ORDERS = [
  {
    id: 'SK-2026-9812',
    date: '2026-10-30T18:45:00',
    customerName: 'Muhammad Hamza',
    phone: '03001234567',
    whatsapp: '03001234567',
    address: 'House # 42-B, Sector F-7/2',
    city: 'Islamabad',
    postalCode: '44000',
    notes: 'Please call before delivering.',
    items: [
      { id: 'gt-002', name: 'Royal Oud & Cedarwood Beard Growth & Conditioning Oil', price: 1950, quantity: 1, variant: '50ml' },
      { id: 'gt-001', name: "Men's Activated Charcoal Oil-Clear Face Wash", price: 1400, quantity: 1, variant: '150ml' }
    ],
    subtotal: 3350,
    discount: 0,
    couponCode: '',
    shipping: 0,
    total: 3350,
    paymentMethod: 'COD',
    status: 'Shipped',
    trackingNumber: 'TCS-92837418'
  },
  {
    id: 'SK-2026-9805',
    date: '2026-10-30T14:20:00',
    customerName: 'Ayesha Siddiqua',
    phone: '03217654321',
    whatsapp: '03217654321',
    address: 'Flat 402, Al-Razi Heights, Gulshan-e-Iqbal Block 6',
    city: 'Karachi',
    postalCode: '75300',
    notes: 'Deliver between 2 PM and 6 PM.',
    items: [
      { id: 'sk-001', name: '24K Pure Gold Radiance Glow Serum', price: 2850, quantity: 1, variant: '30ml Regular' },
      { id: 'fr-001', name: 'Royal Jasmine & White Musk Eau De Parfum 100ml', price: 4500, quantity: 1, variant: '100ml Full Size' }
    ],
    subtotal: 7350,
    discount: 735,
    couponCode: 'WELCOME10',
    shipping: 0,
    total: 6615,
    paymentMethod: 'COD',
    status: 'Processing',
    trackingNumber: 'LEO-4819203'
  },
  {
    id: 'SK-2026-9791',
    date: '2026-10-29T21:10:00',
    customerName: 'Zainab Bibi',
    phone: '03338901234',
    whatsapp: '03338901234',
    address: 'Near Jamia Masjid, Model Town',
    city: 'Lahore',
    postalCode: '54700',
    notes: '',
    items: [
      { id: 'sk-002', name: 'Pure Saffron & Rose Glow Face Cream', price: 2200, quantity: 1, variant: '50g Standard' },
      { id: 'sk-005', name: 'Ultra-Matte Invisible Sunscreen Gel SPF 60 PA+++', price: 1950, quantity: 1, variant: '50ml' }
    ],
    subtotal: 4150,
    discount: 0,
    couponCode: '',
    shipping: 0,
    total: 4150,
    paymentMethod: 'Bank Transfer',
    status: 'Confirmed',
    trackingNumber: 'TRAX-8172635'
  }
];
