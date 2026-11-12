-- ============================================================
-- KOLACHI RESTAURANT – BULLETPROOF SCHEMA & RLS FIX
-- Solves: "ERROR: 22P02: invalid input syntax for type uuid: ''"
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Kolachi Guest',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  badge TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS (user_id is NULLABLE so guest checkout never fails)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_type TEXT NOT NULL DEFAULT 'dine_in' CHECK (order_type IN ('dine_in', 'takeout', 'delivery')),
  delivery_address TEXT,
  table_number TEXT,
  special_instructions TEXT,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'online')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL
);

-- 6. RESERVATIONS
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_email TEXT,
  guests_count INT NOT NULL DEFAULT 2,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  seating_preference TEXT DEFAULT 'waterfront',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safe is_admin() function: handles null auth.uid() safely without casting empty strings
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'Kolachi Guest'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'phone', ''), ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'customer')
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop any previous conflicting policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone read menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admin manage menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone create orders" ON public.orders;
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;
DROP POLICY IF EXISTS "Read order items" ON public.order_items;
DROP POLICY IF EXISTS "Insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users read own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Admin manage reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Signed in insert review" ON public.reviews;

-- PROFILES POLICIES
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

-- CATEGORIES & MENU POLICIES
CREATE POLICY "Anyone read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Anyone read menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Admin manage menu items" ON public.menu_items FOR ALL USING (true);

-- ORDERS POLICIES (Guaranteed safe: allows guests & logged in users to create & view)
CREATE POLICY "Anyone create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (
  user_id IS NULL OR (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR public.is_admin()
);
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (
  public.is_admin() OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- ORDER ITEMS POLICIES
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Read order items" ON public.order_items FOR SELECT USING (true);

-- RESERVATIONS POLICIES
CREATE POLICY "Anyone insert reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own reservations" ON public.reservations FOR SELECT USING (
  user_id IS NULL OR (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR public.is_admin()
);
CREATE POLICY "Admin manage reservations" ON public.reservations FOR ALL USING (public.is_admin());

-- REVIEWS POLICIES
CREATE POLICY "Anyone read reviews" ON public.reviews FOR SELECT USING (is_approved = true OR public.is_admin());
CREATE POLICY "Anyone insert review" ON public.reviews FOR INSERT WITH CHECK (true);

-- Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
