-- ========================================================================
-- SK.SHOP.PK — SUPABASE DATABASE SCHEMA & INITIAL DATA
-- Project ID: bkdammlmnxplntobphzl
-- URL: https://bkdammlmnxplntobphzl.supabase.co
-- ========================================================================

-- 1. DROP EXISTING TABLES IF NEEDED
DROP TABLE IF EXISTS public.contact_messages CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- 2. CREATE PRODUCTS TABLE
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT DEFAULT 'SK Luxe Skin',
    gender TEXT NOT NULL, -- 'ladies', 'gents', 'unisex'
    category TEXT NOT NULL, -- 'skincare', 'haircare', 'fragrances', 'bodycare', 'makeup', 'grooming'
    subcategory TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    rating NUMERIC DEFAULT 4.9,
    review_count INTEGER DEFAULT 10,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 25,
    images JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    specs JSONB DEFAULT '{}'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    reviews JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE ORDERS TABLE
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'SK-2026-9812'
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    tracking_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE COUPONS TABLE
CREATE TABLE public.coupons (
    code TEXT PRIMARY KEY,
    discount_type TEXT NOT NULL, -- 'percentage', 'fixed', 'free_shipping'
    discount_value NUMERIC NOT NULL,
    min_order NUMERIC DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE CONTACT MESSAGES TABLE
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allow public access for customer browsing, checkout, order tracking & store management
-- ========================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view, insert, update, and delete
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON public.products FOR DELETE USING (true);

-- Orders: Everyone can create orders, track orders by ID, and update status
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);

-- Coupons: Everyone can view coupons, and admin can manage
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Insert Coupons" ON public.coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Coupons" ON public.coupons FOR DELETE USING (true);

-- Contact Messages: Everyone can submit contact messages
CREATE POLICY "Public Insert Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Messages" ON public.contact_messages FOR SELECT USING (true);

-- ========================================================================
-- INITIAL SEED DATA
-- ========================================================================

-- Insert Coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order, description) VALUES
('WELCOME10', 'percentage', 10, 0, '10% off your entire order'),
('SKGOLD', 'percentage', 15, 3500, '15% off on luxury orders over Rs. 3,500'),
('FREESHIP', 'free_shipping', 200, 1500, 'Free Nationwide Courier Delivery');

-- Insert Initial Products
INSERT INTO public.products (
    id, name, brand, gender, category, subcategory, price, original_price,
    rating, review_count, is_new, is_bestseller, is_offer, stock, images,
    description, specs, variants, reviews
) VALUES
(
    'sk-001',
    '24K Pure Gold Radiance Glow Serum',
    'SK Luxe Skin',
    'ladies',
    'skincare',
    'Serums',
    2850,
    3800,
    4.9,
    84,
    true,
    true,
    true,
    28,
    '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Infused with genuine 24-karat gold flakes, hyaluronic acid, and collagen-boosting peptides. Gently revitalizes dull skin, reduces fine lines, and imparts a luminous royal bridal glow suitable for all Pakistani skin types.',
    '{"volume": "30ml Glass Dropper", "skinType": "All Skin Types", "keyIngredients": "24K Gold Foil, Hyaluronic Acid, Niacinamide, Vitamin C", "howToUse": "Apply 3-4 drops morning and night.", "origin": "Imported Actives", "expiry": "36 Months"}'::jsonb,
    '[{"name": "30ml Regular", "price": 2850}, {"name": "50ml Deluxe", "price": 3950}]'::jsonb,
    '[{"author": "Ayesha K. (Lahore)", "rating": 5, "date": "2 days ago", "comment": "MashAllah the glow is unbelievable! Non-greasy and feels so luxury on skin."}, {"author": "Fatima Z. (Karachi)", "rating": 5, "date": "1 week ago", "comment": "Ordered via WhatsApp and received within 2 days in Karachi. 100% original!"}]'::jsonb
),
(
    'sk-002',
    'Pure Saffron & Rose Glow Face Cream',
    'SK Herbal Organics',
    'ladies',
    'skincare',
    'Face Cream',
    2200,
    2900,
    4.8,
    62,
    false,
    true,
    false,
    35,
    '["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Enriched with authentic Kashmiri Saffron (Zafran) and pure damask rose water. Deeply hydrates, evens skin tone, and helps fade blemishes and dark spots while providing round-the-clock softness.',
    '{"volume": "50g Luxury Jar", "skinType": "Normal, Dry & Combination Skin", "keyIngredients": "Kashmiri Zafran, Organic Rose Extract, Sweet Almond Oil", "howToUse": "Gently massage onto face and neck.", "origin": "Handcrafted Organic", "expiry": "24 Months"}'::jsonb,
    '[{"name": "50g Standard", "price": 2200}, {"name": "100g Value Tub", "price": 3400}]'::jsonb,
    '[{"author": "Zainab N. (Islamabad)", "rating": 5, "date": "3 days ago", "comment": "The aroma of real saffron is divine! Leaves my skin so velvety soft."}]'::jsonb
),
(
    'sk-003',
    'Hydra-Plump Niacinamide & Rice Water Moisturizer',
    'DermaGlow PK',
    'ladies',
    'skincare',
    'Moisturizers',
    1950,
    2600,
    4.7,
    45,
    true,
    false,
    true,
    40,
    '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1512290900672-1f413a9675bd?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Lightweight gel-cream formula combining 5% Niacinamide and fermented Korean rice water. Strengthens skin barrier, minimizes enlarged pores, and locks in 72-hour moisture without stickiness.',
    '{"volume": "60ml Pump Dispenser", "skinType": "Oily & Sensitive Skin", "keyIngredients": "Niacinamide 5%, Fermented Rice Water", "howToUse": "Apply evenly after serum.", "origin": "Imported Actives", "expiry": "36 Months"}'::jsonb,
    '[{"name": "60ml", "price": 1950}]'::jsonb,
    '[{"author": "Mehwish B. (Faisalabad)", "rating": 5, "date": "5 days ago", "comment": "Best moisturizer for humid weather. Does not make my T-zone oily at all."}]'::jsonb
),
(
    'sk-004',
    'Tea Tree & Neem Purifying Gentle Face Wash',
    'SK Pure Balance',
    'ladies',
    'skincare',
    'Face Wash',
    1450,
    1850,
    4.8,
    97,
    false,
    true,
    false,
    50,
    '["https://images.unsplash.com/photo-1556228722-d0b7720977a4?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1608248597359-53e944747eb4?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Sulfate-free acne defense face wash with Australian Tea Tree Oil and wild Pakistani Neem leaves. Washes away excess sebum, unclogs deep pores, and eliminates acne-causing bacteria without stripping natural moisture.',
    '{"volume": "150ml Tube", "skinType": "Acne-Prone & Oily Skin", "keyIngredients": "Organic Neem Extract, Melaleuca Tea Tree, Salicylic Acid 1%", "howToUse": "Massage over face for 60 seconds, rinse.", "origin": "Clinical Grade", "expiry": "24 Months"}'::jsonb,
    '[{"name": "150ml Standard", "price": 1450}, {"name": "250ml Family Pack", "price": 2150}]'::jsonb,
    '[{"author": "Saba R. (Rawalpindi)", "rating": 5, "date": "1 week ago", "comment": "Cleared my stubborn breakouts within 10 days. Very refreshing."}]'::jsonb
),
(
    'sk-005',
    'Ultra-Matte Invisible Sunscreen Gel SPF 60 PA+++',
    'SK SunShield Pro',
    'ladies',
    'skincare',
    'Sunscreens',
    1950,
    2500,
    4.9,
    110,
    true,
    true,
    true,
    65,
    '["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Zero white cast, non-comedogenic broad-spectrum sun defense engineered for extreme Pakistani summer heat. Water and sweat resistant for up to 80 minutes, perfectly priming skin under makeup.',
    '{"volume": "50ml Airless Tube", "skinType": "All Skin Types", "keyIngredients": "Zinc Oxide, Titanium Dioxide, Hyaluronic Acid", "howToUse": "Apply generously 15 mins before sun.", "origin": "Dermatologist Tested", "expiry": "36 Months"}'::jsonb,
    '[{"name": "50ml", "price": 1950}]'::jsonb,
    '[{"author": "Dr. Rabia H. (Karachi)", "rating": 5, "date": "4 days ago", "comment": "Zero white cast! Sits beautifully under makeup. Highly recommended."}]'::jsonb
),
(
    'gt-001',
    'Men Activated Charcoal Oil-Clear Face Wash',
    'SK Man Pro Grooming',
    'gents',
    'skincare',
    'Men Face Wash',
    1400,
    1800,
    4.8,
    94,
    false,
    true,
    false,
    60,
    '["https://images.unsplash.com/photo-1556228722-d0b7720977a4?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Formulated specifically for Pakistani men facing daily traffic dust, smoke, and sweat. Activated bamboo charcoal draws out deep pollution impurities, unclogs pores, and prevents blackheads with an icy cooling blast.',
    '{"volume": "150ml Tube", "skinType": "Men Oily & Pollution-Exposed Skin", "keyIngredients": "Activated Bamboo Charcoal, Menthol, Salicylic Acid", "howToUse": "Lather onto face, rinse with cold water.", "origin": "Engineered for Men", "expiry": "36 Months"}'::jsonb,
    '[{"name": "150ml", "price": 1400}, {"name": "250ml Gym Pack", "price": 2100}]'::jsonb,
    '[{"author": "Hamza A. (Lahore)", "rating": 5, "date": "2 days ago", "comment": "Instant fresh cooling feeling! Removes all oil after biking through Lahore traffic."}]'::jsonb
),
(
    'gt-002',
    'Royal Oud & Cedarwood Beard Growth & Conditioning Oil',
    'SK Man Pro Grooming',
    'gents',
    'grooming',
    'Beard Oils',
    1950,
    2600,
    4.9,
    125,
    false,
    true,
    true,
    48,
    '["https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Pakistan favorite beard elixir. Combines cold-pressed Moroccan Argan, Jojoba, and Castor oils scented with regal Arabian Oud and Texas Cedarwood. Fills in patchy beards, stops beard itch and dandruff, and leaves a majestic manly scent.',
    '{"volume": "50ml Amber Glass Dropper", "beardType": "Patchy, Stiff & Growing Beards", "keyIngredients": "Pure Oud Extract, Castor Oil, Vitamin E, Cedarwood", "howToUse": "Massage 4-6 drops deep into beard daily.", "origin": "100% Organic", "expiry": "36 Months"}'::jsonb,
    '[{"name": "50ml", "price": 1950}]'::jsonb,
    '[{"author": "Bilal M. (Islamabad)", "rating": 5, "date": "3 days ago", "comment": "The oud scent is luxurious and not overpowering. Softens coarse beard immediately."}]'::jsonb
),
(
    'gt-003',
    'Midnight Sovereign Men Extrait De Parfum 100ml',
    'SK Private Blend',
    'gents',
    'fragrances',
    'Men Perfumes',
    4800,
    6200,
    5.0,
    140,
    true,
    true,
    true,
    18,
    '["https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'A dark, charismatic fragrance designed for the discerning gentleman. Opens with sharp pink pepper and Calabrian bergamot, evolving into smoky incense, rich leather, and a deep base of rare Cambodian Oud and tonka bean.',
    '{"volume": "100ml Heavy Black Flask", "concentration": "Extrait De Parfum (30% Oil)", "topNotes": "Bergamot, Pink Pepper", "heartNotes": "Incense, Leather", "baseNotes": "Cambodian Oud, Patchouli, Tonka", "origin": "Imported Oils", "expiry": "60 Months"}'::jsonb,
    '[{"name": "50ml Pocket Flask", "price": 3100}, {"name": "100ml Luxury Box", "price": 4800}]'::jsonb,
    '[{"author": "Capt. Tariq N. (Rawalpindi)", "rating": 5, "date": "Yesterday", "comment": "Projects for 10 hours effortlessly. Got countless compliments at an event."}]'::jsonb
),
(
    'un-001',
    'Imperial Royal Amber & Oud Extrait 100ml',
    'SK Private Blend',
    'unisex',
    'fragrances',
    'Fragrances',
    5800,
    7500,
    5.0,
    165,
    true,
    true,
    true,
    15,
    '["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Our crown jewel unisex fragrance. Crafted with aged Cambodian Agarwood, golden warm amber, Taif rose, and precious saffron. Loved equally by men and women who appreciate opulent oriental perfumery.',
    '{"volume": "100ml Decanter with Gold Neck", "concentration": "Extrait De Parfum (32%)", "sillage": "Colossal (14+ Hours)", "origin": "Handmade Luxury", "expiry": "60 Months"}'::jsonb,
    '[{"name": "50ml", "price": 3600}, {"name": "100ml Crown Edition", "price": 5800}]'::jsonb,
    '[{"author": "Malik Jahangir (Islamabad)", "rating": 5, "date": "3 days ago", "comment": "The finest Oud fragrance in Pakistan at this price point. Remarkable longevity!"}]'::jsonb
),
(
    'un-003',
    'Pure Damask Rose Water Distillate (Arq-e-Gulab) 200ml',
    'SK Herbal Organics',
    'unisex',
    'skincare',
    'Skincare',
    950,
    1250,
    4.9,
    130,
    false,
    true,
    false,
    80,
    '["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    'Triple-steam distilled from wild Punjab Rosa Damascena petals. Pure natural toner and refreshing mist without added alcohol, artificial fragrance, or preservatives. Instantly balances pH and tightens pores.',
    '{"volume": "200ml Ultra-Fine Mist Spray", "skinType": "All Skin Types", "keyIngredients": "100% Steam-Distilled Rose Water", "origin": "Traditional Pure Distillation", "expiry": "24 Months"}'::jsonb,
    '[{"name": "200ml Spray", "price": 950}, {"name": "500ml Refill", "price": 1700}]'::jsonb,
    '[{"author": "Sumbul M. (Lahore)", "rating": 5, "date": "4 days ago", "comment": "The finest Arq-e-Gulab in Pakistan! Smells like fresh morning roses."}]'::jsonb
);

-- Insert Sample Orders
INSERT INTO public.orders (
    id, customer_name, phone, whatsapp, address, city, postal_code, notes,
    items, subtotal, discount, coupon_code, shipping, total, payment_method, status, tracking_number
) VALUES
(
    'SK-2026-9812',
    'Muhammad Hamza',
    '03001234567',
    '03001234567',
    'House # 42-B, Sector F-7/2',
    'Islamabad',
    '44000',
    'Please call before delivering.',
    '[{"id": "gt-002", "name": "Royal Oud & Cedarwood Beard Growth & Conditioning Oil", "price": 1950, "quantity": 1, "variant": "50ml"}, {"id": "gt-001", "name": "Men Activated Charcoal Oil-Clear Face Wash", "price": 1400, "quantity": 1, "variant": "150ml"}]'::jsonb,
    3350,
    0,
    '',
    0,
    3350,
    'Cash on Delivery (COD)',
    'Shipped',
    'TCS-92837418'
),
(
    'SK-2026-9805',
    'Ayesha Siddiqua',
    '03217654321',
    '03217654321',
    'Flat 402, Al-Razi Heights, Gulshan-e-Iqbal Block 6',
    'Karachi',
    '75300',
    'Deliver between 2 PM and 6 PM.',
    '[{"id": "sk-001", "name": "24K Pure Gold Radiance Glow Serum", "price": 2850, "quantity": 1, "variant": "30ml Regular"}]'::jsonb,
    2850,
    285,
    'WELCOME10',
    200,
    2765,
    'Cash on Delivery (COD)',
    'Processing',
    'LEO-4819203'
);
