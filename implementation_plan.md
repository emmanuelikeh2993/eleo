# ELEO Campus Egg Commerce Platform — Implementation Plan

## 1. Project Context & Principles

```
PRODUCT: ELEO Campus Egg Commerce Platform
WHAT IT DOES: A fast, mobile-first PWA for campus students to order fresh eggs directly to their hostels via manual bank transfer, with a centralized admin management dashboard for payments and fulfillment.
WHO USES IT: University undergraduate and postgraduate students living in campus hostels/blocks who cook or track protein intake, and one farm operations administrator managing orders and bank reconciliations.
VOICE: Direct, dependable, utilitarian, and warm.
NON-NEGOTIABLE CONSTRAINTS: 24-hour build timeline, phone-first responsive PWA, zero hardcoded frontend prices (DB single source of truth), manual bank transfer flow (no payment gateway fees), strict admin role isolation.
```

---

## 2. Design Foundation & Restraint Audit

### Color Palette
- **`#0F2F1D` (Deep Farm Green)**: Primary brand anchor. Conveys agricultural provenance and fresh farm harvest without resorting to generic high-saturation SaaS greens.
- **`#F9FAF8` (Eggshell Canvas)**: Base background. Softer than pure `#FFFFFF`, cutting screen glare on phone screens in dormitory lighting or midday outdoor sun.
- **`#1C201D` (Charcoal Slate)**: High-contrast ink for prices, quantities, and order reference codes. Ensures AAA accessibility against eggshell.
- **`#E2E8DF` (Muted Sage Border)**: Subtle structural divider separating order docket items, avoiding heavy drop shadows or card clutter.
- **`#B45309` (Amber Ochre)**: Reserved strictly for pending state tags (`Pending Payment Confirmation`) and transfer instructions.
- **`#15803D` (Harvest Emerald)**: Reserved strictly for confirmed statuses (`Payment Confirmed`, `Delivered`, `Completed`).

### Typography
- **Primary Typeface**: `Inter` (or system `-apple-system, BlinkMacSystemFont, "Segoe UI"` fallback).
- **Rationale**: Flawlessly legible at compact mobile viewports, clear distinct numerals for prices (`₦4,200`), crate counts (`30 eggs`), phone numbers, and unique order numbers (`EGG-000124`).
- **Restraint Rule**: Exactly one font family. No faux-luxury serifs, no decorative all-caps label spam, and no monospace chrome for non-code data.

### Layout Structure
*Single-column, mobile-constrained viewport (max-width 480px on desktop) anchored by a 48px sticky utility header and a persistent high-contrast bottom action docket.*

```
+------------------------------------------------+
|  ELEO  [Hostel Hub]                  [Orders]  |  <- Sticky 48px header
+------------------------------------------------+
|  Fresh Eggs. Simple Ordering.                  |
|  Direct from ELEO Farm to your campus hostel.  |
|                                                |
|  [ Active Order Status Banner (if open) ]      |  <- Direct leap to tracking
|                                                |
|  DAILY CRATES                                  |
|  +------------------------------------------+  |
|  | Crate of 30 (Standard)          ₦4,200   |  |
|  | Farm-collected daily. Sturdy brown shell.|  |
|  | [ - 1 + ]                   [Add ₦4,200] |  |
|  +------------------------------------------+  |
|  | Half Crate (15 Eggs)            ₦2,200   |  |
|  | Secure cardboard split carton.           |  |
|  |                             [Add ₦2,200] |  |
|  +------------------------------------------+  |
|  | Jumbo Crate (30 Eggs)       [Sold Out]   |  |  <- Visibly disabled
+------------------------------------------------+
|  TRAY: 1 Crate (₦4,200)        [Review Order]  |  <- Fixed bottom action tray
+------------------------------------------------+
```

### The ONE Memorable Element
- **The Physical Receipt-Style Order Docket**: After tapping *"I've Made Payment"*, the student receives a clean, printable/screenshot-ready digital receipt docket showing their live sequence badge (`EGG-000124`), delivery hostel snapshot, ELEO bank verification stamp, and one-tap reorder/support link. It mirrors a campus shop slip and removes all delivery dispute friction.

### Deliberate Omissions (What We Chose NOT to Build)
- No user account password login friction for students (phone-anchored profile).
- No animated decorative gradients, glassmorphism, or custom cursors.
- No automated payment gateway integration (Stripe/Paystack webhook overhead avoided for MVP).
- No multi-step checkout wizard; order form is a single, clear sheet.
- No AI nutrition coaches, calorie calculators, or fitness trackers (nutrition page is 5 curated static goal statements with direct egg buying buttons).

---

## 3. Resolution of Open Questions (from PDF Section 6)

1. **Delivery Fee**:
   - Add `delivery_fee NUMERIC(10,2) DEFAULT 0.00` to the `orders` table.
   - Store flat campus delivery fee (e.g. `₦300.00`) in `app_settings`.
   - Pickup orders enforce `delivery_fee = 0.00`. Delivery orders compute `total = subtotal + delivery_fee`.
2. **Customer Note**:
   - Add `customer_note TEXT` to the `orders` table to capture specific room delivery directions (e.g. *"Leave at Hall 3 porter desk"*).
3. **Product Quantity Meaning**:
   - Clarified as **`pack_size`** (e.g., 30 for full crate, 15 for half crate, 6 for half-dozen).
   - In stock availability is governed by the `available BOOLEAN` flag (with optional `stock_count INTEGER` for inventory decrementing).
4. **Bank Details Storage**:
   - Stored in an `app_settings` key-value table so administrators can update bank name, account number, and recipient name on the fly without a code rebuild or deployment.
5. **Guest vs. Account Checkout**:
   - **Frictionless Phone-Anchored Checkout**: Students do not need passwords. They enter Name + Phone + Hostel + Room once. Saved to browser `localStorage` and upserted into the `users` table upon order placement. Admin uses secure Supabase Auth (Email + Password).

---

## 4. Database Schema (PostgreSQL / Supabase DDL)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. App Settings (Bank details, flat delivery fee, announcement)
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial bank details & delivery fee
INSERT INTO app_settings (key, value) VALUES
('bank_details', '{"bank_name": "Zenith Bank", "account_name": "ELEO FARM & FOODS LTD", "account_number": "1012345678", "instructions": "Use your Order Number as payment reference."}'),
('delivery_fee', '{"campus_flat_rate": 300.00, "currency": "NGN"}');

-- 2. Users (Students)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    hostel TEXT NOT NULL,
    room TEXT NOT NULL,
    goal TEXT CHECK (goal IN ('muscle', 'gain', 'lose', 'maintain', 'healthier')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    pack_size INTEGER NOT NULL DEFAULT 30,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Order Sequence Generator
CREATE SEQUENCE order_number_seq START WITH 101;

-- 5. Orders
CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'pending_confirmation', 'confirmed');
CREATE TYPE order_status_enum AS ENUM (
    'received',
    'payment_confirmed',
    'preparing',
    'ready',
    'delivered',
    'completed',
    'cancelled'
);
CREATE TYPE fulfillment_method_enum AS ENUM ('pickup', 'delivery');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL DEFAULT ('EGG-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0')),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL,
    payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
    order_status order_status_enum NOT NULL DEFAULT 'received',
    fulfillment_method fulfillment_method_enum NOT NULL DEFAULT 'delivery',
    delivery_location TEXT NOT NULL,
    customer_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Admin Dashboard Queries
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(order_status, payment_status);
CREATE INDEX idx_users_phone ON users(phone);
```

---

## 5. System Architecture & Tech Stack

| Layer | Selection | Justification |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Actions) | Zero-API boilerplate, immediate server-side price validation, instant SSR rendering for mobile PWAs. |
| **Styling** | Vanilla CSS / Tailored Tailwind CSS tokens | Exact bespoke typography, high-contrast tap targets, zero bloated animation libraries. |
| **Database & Auth** | Supabase (PostgreSQL + RLS + GoTrue Auth) | Relational integrity for orders and financial records; email/password auth for admin, direct public RPC/actions for student flow. |
| **PWA Engine** | `@serwist/next` or standard Web Manifest + Service Worker | Off-the-shelf offline app shell caching, home screen install prompt, 192px/512px icon manifests. |
| **Hosting** | Vercel | HTTPS mandatory for PWA service workers, instant zero-downtime atomic deployments. |

---

## 6. End-to-End User Flow & Screen Breakdown

### Student PWA (`/`)
1. **Home / Landing Screen**:
   - Header: ELEO logo + Campus tag + Quick link to *My Orders*.
   - Headline: *"Fresh Eggs. Simple Ordering."*
   - Active Order Sticky Banner (shown if student has an active uncompleted order in `localStorage`).
   - 3 Quick Navigation Tiles: `Order Eggs`, `Track Orders`, `Nutrition & Goals`.
2. **Catalogue & Cart (`/order`)**:
   - Live products list queried from Supabase.
   - Stock status (`Available` with quantity counter or muted `Sold Out`).
   - Sticky bottom drawer: Item count, Subtotal, and `Continue to Checkout` button.
3. **Checkout Screen (`/checkout`)**:
   - Prefills Name, Phone, Hostel, Room if returning student.
   - Fulfillment selector:
     - `Campus Delivery (+₦300)` -> requires Hostel + Room/Block + Delivery Note.
     - `Pickup Point (₦0)` -> shows ELEO Farm Depot Campus location & pickup hours.
   - Server Action `createOrder`:
     - Reads live product price from DB (never client-provided price).
     - Inserts `users` profile, generates `orders` with `EGG-XXXXXX`, inserts `order_items`.
     - Returns order payload and redirects to `/payment/[order_number]`.
4. **Bank Transfer Instruction Screen (`/payment/[order_number]`)**:
   - Total amount prominently shown in bold.
   - Bank details card (Bank Name, Account Number with one-tap copy button, Account Name).
   - Reference reminder: *"Use **EGG-000124** as your bank transfer remark/narration."*
   - Primary action: `"I've Made Payment"` button -> updates `payment_status = 'pending_confirmation'` and directs to live tracking.
5. **Live Order Docket & Tracker (`/track/[order_number]`)**:
   - 5-stage progress ribbon:
     1. `Order Received`
     2. `Payment Confirmed`
     3. `Preparing Crates`
     4. `Ready for Pickup / Out for Delivery`
     5. `Completed`
   - Real-time polling or Supabase Realtime subscription on order row.
   - Hostel delivery address docket details.
   - Direct WhatsApp / SMS help button with prefilled order number.
6. **Customer Profile & Order History (`/profile`)**:
   - Saved delivery location (Hostel name, Room number).
   - Chosen goal (e.g. *Build Muscle*, *Eat Healthier*).
   - Order history list with order date, total, status pill, and one-tap `"Reorder"` button.
7. **Basic Nutrition Page (`/nutrition`)**:
   - 5 goals: *Build muscle*, *Gain weight*, *Lose weight*, *Maintain weight*, *Eat healthier*.
   - Plain, factual, non-medical copy for each (e.g. *"Eggs provide 6g of complete bioavailable protein per serving to support muscular recovery."*).
   - Direct button on each card: `"Order Muscle Crate"` linking directly to catalogue.

### Admin Dashboard (`/admin`)
1. **Admin Login (`/admin/login`)**:
   - Simple, robust Supabase Auth email/password.
   - Session verification middleware preventing unauthorized access to all `/admin/*` routes.
2. **Dashboard Overview (`/admin`)**:
   - Metric Tiles:
     - **Today's Orders** (count)
     - **Pending Payments** (count requiring bank statement check)
     - **Orders Preparing** (active packing queue)
     - **Ready / En Route** (awaiting pickup or student handover)
     - **Completed Today** (total fulfilled)
     - **Total Confirmed Revenue** (sum of ₦ for confirmed orders)
3. **Orders Operations Table (`/admin/orders`)**:
   - Filter tabs: `All`, `Needs Confirmation`, `Preparing`, `Out for Delivery`, `Completed`.
   - Columns: Order #, Customer Name & Phone, Items & Crates, Total (₦), Hostel/Room, Fulfillment, Payment Status, Order Status, Actions.
   - One-Click Status Modals / Quick Actions:
     - `Confirm Payment` -> sets `payment_status = 'confirmed'`, `order_status = 'payment_confirmed'`.
     - `Mark Preparing` -> sets `order_status = 'preparing'`.
     - `Mark Ready / Dispatched` -> sets `order_status = 'ready'`.
     - `Mark Delivered / Completed` -> sets `order_status = 'completed'`.
     - `Cancel Order` -> sets `order_status = 'cancelled'`.
4. **Product & Inventory Management (`/admin/products`)**:
   - Add new crate size or modify existing egg products.
   - Live price editor (`numeric(10,2)`).
   - Instant toggle: `Available` / `Out of Stock`.
5. **Settings Management (`/admin/settings`)**:
   - Update receiving bank name, account number, and account holder name without touching code.
   - Update standard campus delivery fee.

---

## 7. 24-Hour Implementation Timeline

```
[Hours 00-03] Infrastructure, Database & PWA Skeleton
  - Initialize Next.js project with App Router, TypeScript, and modern styling tokens.
  - Setup Supabase project, execute migration script (DDL), configure RLS policies.
  - Configure PWA manifest.json, service worker caching shell, and icons (192px/512px).
  - Seed initial ELEO egg products and bank settings.

[Hours 03-08] Student Storefront & Cart Experience
  - Landing screen with high-impact brand headline and order routes.
  - Live product catalogue reading directly from Supabase.
  - Mobile cart drawer with quantity adjustments and subtotal calculation.
  - Checkout form capturing student contact, hostel, room number, and delivery preferences.

[Hours 08-12] Server Order Pipeline & Manual Bank Transfer Flow
  - Secure Server Action validating live prices and generating sequence-based EGG-XXXXXX.
  - Bank transfer payment instructions screen with 1-tap clipboard copy.
  - "I've Made Payment" transition updating payment_status to 'pending_confirmation'.
  - LocalStorage hydration for returning student profiles.

[Hours 12-17] Secure Admin Dashboard & Fulfillment Engine
  - Supabase Auth integration with server-side middleware role protection.
  - Admin operational metrics (Revenue, Pending Payments, Preparing, Ready).
  - Orders management table with inline status transition triggers.
  - Product price and availability editing UI with real-time sync.

[Hours 17-20] Order Tracking, Docket & Student Profile
  - Real-time customer order docket with 5-stage visual milestone tracker.
  - Customer order history view with 1-click reorder capability.
  - Nutrition & goal-based quick selection cards.

[Hours 20-22] Settings & Polish
  - Admin bank account settings editor.
  - Offline fallback shell and PWA install prompt banner.
  - Full keyboard accessibility, contrast audit, and mobile tap target verification.

[Hours 22-24] Acceptance QA & End-to-End Demo Run
  - Complete round-trip smoke test on physical mobile devices:
    Student opens PWA -> adds Crate of 30 -> checkouts to Hall 2 Room 14 -> views bank details -> taps payment made ->
    Admin confirms payment -> advances through preparing/ready -> student live docket reflects completed.
```

---

## 8. Definition of Done & Acceptance Criteria

1. **Mobile Experience**: PWA installable on iOS and Android devices; tap targets $\ge 44\text{px}$; no horizontal overflow; fast initial paint.
2. **Data Integrity**: Zero hardcoded prices in the frontend. All order amounts and line item snapshots are verified and stored on the server.
3. **Happy Path Completion**: A student can place an order and see their live tracking docket without manual developer intervention.
4. **Admin Autonomy**: The ELEO operations administrator can verify bank transfers, advance fulfillment states, update product prices, and edit bank details directly from the dashboard.
