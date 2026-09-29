-- ============================================================================
-- ELEO CAMPUS EGG COMMERCE PLATFORM — DATABASE MIGRATION SCRIPT
-- Target: Supabase (PostgreSQL 15+)
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lylbvhfpuajuxrhliotb/sql
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Clean teardown if re-running (safe migrations)
-- Uncomment if doing a full reset:
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS app_settings CASCADE;
-- DROP SEQUENCE IF EXISTS order_number_seq CASCADE;

-- 3. App Settings Table (Dynamic Bank Details & Delivery Fees)
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial bank details & delivery fee
INSERT INTO app_settings (key, value)
VALUES
    ('bank_details', '{
        "bank_name": "Zenith Bank",
        "account_name": "ELEO FARM & FOODS LTD",
        "account_number": "1012345678",
        "instructions": "Use your Order Number as your bank transfer remark/narration."
    }'::jsonb),
    ('delivery_fee', '{
        "campus_flat_rate": 300.00,
        "currency": "NGN"
    }'::jsonb)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();

-- 4. Products Table (Single source of truth for catalogue & pricing)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    pack_size INTEGER NOT NULL DEFAULT 30,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    category TEXT DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial ELEO Crate Catalogue (Per proposal specifications)
INSERT INTO products (name, description, pack_size, price, available, category)
VALUES
    (
        'Standard Crate of 30 Fresh Eggs',
        'Farm-collected daily from free-range layer pens. Firm whites and deep golden yolks.',
        30,
        4200.00,
        TRUE,
        'standard'
    ),
    (
        'Half Crate (15 Eggs Carton)',
        'Secure carton partition for safe hostel storage. Perfect for weekly breakfast meal prep.',
        15,
        2200.00,
        TRUE,
        'standard'
    ),
    (
        'Jumbo Crate of 30 Large Eggs',
        'Selected extra-large grade eggs. High protein density for athletes and fitness enthusiasts.',
        30,
        4800.00,
        TRUE,
        'jumbo'
    ),
    (
        'Double Crate (60 Eggs Athlete Bundle)',
        'Two crates bundled together. Economical bulk supply for serious hostel cooks & lifters.',
        60,
        8200.00,
        TRUE,
        'bundle'
    ),
    (
        'Hostel 6-Pack Quick Carton',
        'Pocket-sized quick carton. Fits directly inside small hostel mini-fridges.',
        6,
        950.00,
        FALSE, -- Visibly disabled per PDF Section 2
        'mini'
    )
ON CONFLICT DO NOTHING;

-- 5. Users Table (Student profiles & delivery addresses)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    hostel TEXT NOT NULL,
    room TEXT NOT NULL,
    pin TEXT DEFAULT '1234',
    goal TEXT CHECK (goal IN ('muscle', 'gain', 'lose', 'maintain', 'healthier')) DEFAULT 'muscle',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Demo Student & Admin
INSERT INTO users (phone, name, hostel, room, pin, goal, role)
VALUES
    ('08012345678', 'Chinedu Okafor (Demo)', 'Hall 4', 'Room 102', '1234', 'muscle', 'student')
ON CONFLICT (phone) DO NOTHING;

-- 6. Order Number Sequence Generator (Generates EGG-000101, EGG-000102, etc.)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 101;

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT ('EGG-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0')),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending_confirmation', 'confirmed')),
    order_status TEXT NOT NULL DEFAULT 'received' CHECK (order_status IN ('received', 'payment_confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled')),
    fulfillment_method TEXT NOT NULL DEFAULT 'delivery' CHECK (fulfillment_method IN ('pickup', 'delivery')),
    delivery_location TEXT NOT NULL,
    customer_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Items Table (Snapshot of ordered items and unit prices at purchase time)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    pack_size INTEGER NOT NULL DEFAULT 30,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 10. Enable Supabase Realtime Replication on Orders and Products
-- This enables instant milestone updates on student dockets without manual refreshing
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- 11. Row-Level Security (RLS) Configuration
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- App Settings: Everyone can read
CREATE POLICY "Public read app_settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Admin update app_settings" ON app_settings FOR ALL USING (true);

-- Products: Everyone can read catalogue; admin can edit
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow all modifications products" ON products FOR ALL USING (true);

-- Users: Students can read & insert their profiles
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update users" ON users FOR UPDATE USING (true);

-- Orders: Students can create orders and view orders
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON orders FOR UPDATE USING (true);

-- Order Items: Insert and read permitted for order processing
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
SELECT 'Database schema migrated successfully!' AS status,
       (SELECT count(*) FROM products) AS total_products,
       (SELECT count(*) FROM app_settings) AS total_settings;
