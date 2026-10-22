# 👑 Royal Gold Wedding Invitation Website & Admin Dashboard

A production-ready wedding invitation website and complete Admin Dashboard built with React, TypeScript, Tailwind CSS, and Supabase.

Designed with a **Royal Gold & Maroon** palace theme, featuring an animated envelope cover, live countdown clock, multiple ceremony itinerary cards, pre-wedding photo gallery with full-screen lightbox, permanent post-wedding memories albums, real-time RSVP submission with privacy protection, background audio player, WhatsApp invite sharing, and Google Maps directions.

---

## ✨ Key Features

- **Royal Gold Aesthetics**: Curated royal color palette (`#D4AF37` Royal Gold, `#B8860B` Deep Gold, `#4A0E1B` Dark Maroon, `#6D1427` Rich Burgundy, `#FFF8E7` Warm Cream, `#FFFCF5` Ivory White).
- **Animated Invitation Cover**: Royal monogram wax seal and animated opening card with "Open Invitation" action and confetti celebration.
- **Live Wedding Countdown**: Client-side second-by-second countdown with Asia/Kolkata timezone support, offline browser caching, and post-wedding celebration state (*"Our Forever Begins"*).
- **Couple Story & Profiles**: Royal portraits, parent blessings, bios, and nicknames for the groom and bride.
- **Multiple Ceremonies & Itinerary**: Itinerary cards for Ganesh Sthapana, Mehendi, Haldi, Sangeet, Royal Wedding Pheras, and Grand Reception with Google Maps links.
- **Photo Gallery with Lightbox**: Pre-wedding photography grid with full-screen lightbox, keyboard arrows, and captions.
- **After-Wedding Memories ("Our Wedding Memories")**: Permanent section for post-wedding albums that continues working even after the wedding has passed.
- **Interactive RSVP System**: Real-time RSVP with guest name, attendance status, attendee count, phone number, and personal messages. Public privacy protection via PostgreSQL Row Level Security (RLS) policies.
- **WhatsApp Invitation Sharing**: Formatted WhatsApp message with invitation link and native Web Share API support.
- **Background Music**: Floating player with autoplay restriction handling, volume indicators, and MP3 upload.
- **Complete Admin Portal**:
  - `/admin/login` (Authentication with Supabase Auth & demo fallback)
  - `/admin/dashboard` (Analytics, RSVP counts, confirmed guests, quick shortcuts)
  - `/admin/wedding-details` (Couple names, parents, date, venue, maps URL)
  - `/admin/events` (Add, edit, delete, reorder, and toggle visibility of events)
  - `/admin/gallery` (Upload multiple photos, captions, cover selection, delete)
  - `/admin/after-wedding` (Create albums and upload post-wedding memories)
  - `/admin/rsvps` (Search, filter by status, delete spam, and export to CSV)
  - `/admin/settings` (Section visibility toggles, audio setup, and Supabase connection manager)

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti
- **Backend & Database**: Supabase PostgreSQL, Supabase Auth, Supabase Storage
- **Security**: PostgreSQL Row Level Security (RLS) policies protecting private guest information
- **Hosting Compatibility**: Vercel Free, Cloudflare Pages (with `vercel.json` and `_redirects` included)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📖 Deployment & Supabase Setup
For step-by-step instructions on setting up your free Supabase project, executing the database schema, creating your admin account, and deploying for free to Vercel or Cloudflare Pages, see [DEPLOYMENT_AND_SETUP_GUIDE.md](file:///c:/Users/Pradum/Gyanversh/Wedding_website/DEPLOYMENT_AND_SETUP_GUIDE.md).
