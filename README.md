# Kolachi Restaurant Karachi – Website & Supabase Backend 🍽️

A modern, responsive website and customer ordering system for **Kolachi Restaurant Karachi**, situated at Floor 5, The Ocean Mall, Clifton, Karachi.

---

## ⚡ Connected Supabase Backend
- **Project URL:** `https://wzrgdrqiaijtiucvpotc.supabase.co`
- **Publishable Key:** `sb_publishable_8oMZV4dwLjqwtMOQaxbQgw_f7-LY2WS`
- Configured in: [`js/supabaseClient.js`](file:///c:/Users/Admin/Downloads/Restaurant/js/supabaseClient.js)

---

## 🚀 Setup Steps

### 1. Run the Database Schema
1. Open your [Supabase SQL Editor](https://app.supabase.com/project/wzrgdrqiaijtiucvpotc/sql).
2. Copy and paste the entire content of [`supabase_schema.sql`](file:///c:/Users/Admin/Downloads/Restaurant/supabase_schema.sql).
3. Click **Run**. This creates:
   - `profiles` (Auto-created on sign-up)
   - `categories` & `menu_items` (Pre-seeded with Kolachi dishes: Dynamite Prawns, Hunzai Mutton Kebab, Peshawari Karahi, etc.)
   - `orders` & `order_items`
   - `reservations`
   - `reviews`
   - RLS security policies & Realtime synchronization.

### 2. Enable Email Auth in Supabase
1. In your Supabase Dashboard, navigate to **Authentication → Providers → Email**.
2. Make sure **Email Provider** is turned ON.
3. *(Recommended for local development)*: Turn off **"Confirm email"** to allow immediate testing without verification emails.

### 3. Grant Admin Privileges (for Kitchen Staff)
1. Sign up on [`signup.html`](file:///c:/Users/Admin/Downloads/Restaurant/signup.html) with your staff email (e.g. `admin@kolachi.pk`).
2. Run this query in your Supabase SQL Editor:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@kolachi.pk');
   ```
3. Now log in to [`admin.html`](file:///c:/Users/Admin/Downloads/Restaurant/admin.html) to manage live orders and reservations.

---

## 🖥️ Running Locally
To test with active ES modules:
```powershell
python -m http.server 5500
```
Open your browser at `http://localhost:5500`.
