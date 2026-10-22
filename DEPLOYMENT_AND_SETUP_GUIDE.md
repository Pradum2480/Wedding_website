# Royal Gold Wedding Website - Setup & Free Hosting Guide

This guide provides instructions to connect your free **Supabase** backend, deploy to **Vercel** or **Cloudflare Pages** for free, and manage your wedding data.

---

## 1. Quick Local Evaluation (Zero Setup Required)

The application includes an **offline-first cached demo mode**. You can start exploring and testing immediately:

1. Start development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:5173](http://localhost:5173) in your browser.
3. Click **"Open Invitation"** to experience the animated Royal Gold opening cover.
4. Access the **Admin Portal** by clicking the discreet **Admin Portal** link in the footer (or go directly to [http://localhost:5173/admin/login](http://localhost:5173/admin/login)).
5. On the login screen, click **"Click to auto-fill initial demo credentials"** (`admin@wedding.royal` / `RoyalGold2026!`), and explore all dashboard features!

---

## 2. Supabase Free Tier Setup (Database & Storage)

### Step 2.1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (Free plan).
2. Choose a project name (e.g. `royal-wedding`) and database password.
3. Select your closest region (e.g., `South Asia (Mumbai)` for India / `Asia/Kolkata`).
4. Wait 1–2 minutes while Supabase provisions your PostgreSQL database.

### Step 2.2: Apply Database Schema & Policies
1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Copy the entire contents of [supabase/schema.sql](file:///c:/Users/Pradum/Gyanversh/Wedding_website/supabase/schema.sql) and paste it into the query editor.
4. Click **Run**.
5. This script creates:
   - `wedding_settings`: Couple info, wedding dates, venue, and texts.
   - `wedding_events`: Ceremony itinerary, timings, addresses, and maps links.
   - `wedding_albums`: After-wedding album collections.
   - `wedding_photos`: Photo metadata and storage links.
   - `wedding_rsvps`: Guest attendance submissions.
   - `website_settings`: Appearance and section visibility toggles.
   - `wedding-media` storage bucket with public read and authenticated write.
   - Row Level Security (RLS) policies protecting guest phone numbers and private messages from public view.

### Step 2.3: Create Initial Administrator Account
1. In your Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your administrator email (e.g., `admin@wedding.royal` or your personal email) and a strong password.
4. Toggle **Auto Confirm User?** to **ON** (so no email confirmation is required).
5. Click **Create User**.

### Step 2.4: Get Your API Keys
1. In your Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL** (e.g. `https://xyzabcdef.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (starts with `eyJhbGciOi...`).
3. You can either:
   - Add them to `.env` file locally:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
     ```
   - OR enter them directly inside **Admin Portal -> Website Settings -> Supabase Database Connection** and click **Test & Save Connection**!

---

## 3. Free Hosting Deployment

### Option A: Vercel (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: Royal Gold Wedding Invitation Website with Admin Dashboard"
   git push origin main
   ```
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New...** -> **Project**.
4. Select your `Wedding_website` repository.
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
6. Click **Deploy**.
7. Vercel automatically builds and provides you with a free `https://your-wedding.vercel.app` URL!
8. The included `vercel.json` ensures SPA routes like `/admin/login` and `/admin/dashboard` resolve without 404 errors.

---

### Option B: Cloudflare Pages (Alternative)
1. In the Cloudflare Dashboard, go to **Workers & Pages** -> **Create Application** -> **Pages**.
2. Connect to your Git repository.
3. Build configuration:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Click **Save and Deploy**.
6. The included `public/_redirects` ensures seamless SPA routing.

---

## 4. Supabase Free Tier Reliability & Inactivity Pausing

- **Inactivity Pausing**: Supabase Free projects pause after 7 consecutive days of zero database activity.
- **How to Resume**: If the project pauses, log into your Supabase Dashboard and click **"Restore Project"**. It restores within 1 minute.
- **Client Cache Resilience**: The application caches the last successfully fetched wedding details, ceremony itinerary, and photos in the visitor's browser localStorage. If the database is paused, the public website continues to calculate the live countdown and display the invitation without showing a blank error screen.

---

## 5. Backup & Long-Term Data Protection

1. **Guest RSVPs**: Open **Admin Portal** -> **RSVP Submissions** and click **Export CSV** anytime to download an Excel-compatible spreadsheet of all guest names, attendance status, attendee counts, phone numbers, and heartfelt messages.
2. **Database SQL Backup**: In Supabase Dashboard, you can generate a full database dump under **Database** -> **Backups** or via `pg_dump`.
3. **Photographs & Audio**: All files uploaded via the Admin Portal are stored in the `wedding-media` bucket and can be downloaded in batch from **Storage** -> **wedding-media** in your Supabase Dashboard.
