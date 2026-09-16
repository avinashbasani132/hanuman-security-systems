# Hanuman Enterprises — CCTV & Security Systems 🛡️

![Hanuman Enterprises Banner](./public/images/hero-install-real.jpg)

**Hanuman Enterprises** is a premium CCTV installation and security solutions provider based in **Hyderabad**. This is the official business website — a high-performance React application built to convert visitors into customers, featuring a full product catalog, smart checkout flow, live customer reviews, and direct contact integration.

📞 **+91-9014612983** | 💬 WhatsApp available

---

## 🚀 Key Features

### 🛒 Smart Order Flow (Amazon-Style)
- Clicking **"Add to Cart"** opens a customer details form before adding the product
- Collects: Full Name, Mobile, Email, Address, City, Pincode, Landmark
- Form is **pre-filled from localStorage** on return visits
- Indian mobile number & 6-digit pincode validation
- Success animation with team callback confirmation

### ⭐ Live Customer Reviews
- **"Write a Review"** button opens a beautiful review popup
- Animated **star picker** (1–5 stars) with hover preview
- Service type selector (Residential, Commercial, AMC, etc.)
- Reviews saved to and loaded from **Supabase** in real-time
- Average rating badge updates dynamically
- Graceful fallback to static reviews if DB unavailable

### 📞 Floating Contact Buttons
- **Phone call button** (dark) — direct dial to `+91-9014612983`
- **WhatsApp button** (green) — opens chat with pre-filled message
- Both hover with smooth scale + color transitions

### ✨ Scroll Reveal Animations
- Every section animates in as you scroll (fade-up, fade-left, fade-right, zoom-in)
- Powered by native **IntersectionObserver** — zero libraries
- Staggered delays for child cards
- Respects `prefers-reduced-motion` accessibility setting

### 📦 Massive Product Catalog
- **150+ products** across Cameras, DVR/XVR, NVR, Power, Cables, Accessories & Services
- Brand-based navigation: CP PLUS · Hikvision · Dahua · Axis · EZVIZ · TP-Link
- Multi-angle image gallery + 360° viewer placeholder
- Technical specifications table on every product modal
- In-modal and in-card quantity controls

### 📱 Fully Responsive & Mobile Optimised
- Compact footer with 2-column grid layout on mobile
- Hero CTA buttons stack cleanly on small screens
- All modals scroll safely on mobile viewports

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Custom CSS3 — Grid, Flexbox, CSS Variables |
| Backend / DB | [Supabase](https://supabase.com) (reviews table) |
| Products Data | Local JSON (`src/data/products.json`) |
| Hosting | Vercel |

---

## 💻 Local Development

```bash
# 1. Clone
git clone https://github.com/avinashbasani132/hanuman-security-systems.git
cd hanuman-security-systems

# 2. Install
npm install

# 3. Set up environment variables
# Create .env file:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Run dev server
npm run dev
```

Open `http://localhost:5173`

---

## 🗄️ Supabase — Reviews Table Setup

Run this in your **Supabase SQL editor** to enable live reviews:

```sql
create table reviews (
  id           bigint generated always as identity primary key,
  name         text not null,
  service_type text not null,
  review       text not null,
  rating       int  not null check (rating between 1 and 5),
  created_at   timestamptz default now()
);

-- Row-level security
alter table reviews enable row level security;
create policy "Anyone can read reviews" on reviews for select using (true);
create policy "Anyone can add reviews"  on reviews for insert with check (true);
```

---

## 📂 Project Structure

```text
📦 hanuman-security-systems
 ┣ 📂 public
 ┃ ┣ 📂 images              # Product + hero images
 ┃ ┗ 📜 favicon.svg
 ┣ 📂 src
 ┃ ┣ 📂 components
 ┃ ┃ ┣ 📜 Hero.jsx
 ┃ ┃ ┣ 📜 Header.jsx
 ┃ ┃ ┣ 📜 Products.jsx       # Brand grid + product cards + detail modal
 ┃ ┃ ┣ 📜 CustomerFormModal.jsx  # ✨ Amazon-style checkout form
 ┃ ┃ ┣ 📜 Testimonials.jsx   # ✨ Live reviews + Write a Review popup
 ┃ ┃ ┣ 📜 Cart.jsx
 ┃ ┃ ┣ 📜 WhatsAppButton.jsx # 📞 Call + 💬 WhatsApp floating buttons
 ┃ ┃ ┣ 📜 Contact.jsx
 ┃ ┃ ┣ 📜 Features.jsx
 ┃ ┃ ┣ 📜 Solutions.jsx
 ┃ ┃ ┣ 📜 FAQ.jsx
 ┃ ┃ ┗ 📜 Footer.jsx
 ┃ ┣ 📂 context
 ┃ ┃ ┗ 📜 CartContext.jsx    # Cart + customer details state
 ┃ ┣ 📂 hooks
 ┃ ┃ ┗ 📜 useScrollReveal.js # ✨ IntersectionObserver scroll animations
 ┃ ┣ 📂 utils
 ┃ ┃ ┗ 📜 supabase.js
 ┃ ┣ 📂 data
 ┃ ┃ ┗ 📜 products.json      # 150+ product definitions
 ┃ ┣ 📜 App.jsx
 ┃ ┣ 📜 index.css
 ┃ ┗ 📜 main.jsx
 ┗ 📜 package.json
```

---

## ⚙️ Adding New Products

Open `src/data/products.json` and add to the relevant category:

```json
{
  "brand": "CP PLUS",
  "model": "CP-USC-DA24L2",
  "images": ["/images/cp-usc-da24l2.jpg"],
  "name": "2.4MP Analog HD Dome Camera",
  "type": "Dome / Analog HD",
  "tags": ["2.4MP", "20m IR", "Indoor"],
  "desc": "Cost-effective indoor dome camera.",
  "apps": "Indoor Home, Retail Shop",
  "specs": {
    "Resolution": "2.4MP (1080P)",
    "IR Range": "20m"
  }
}
```

---

## 📄 License & Ownership

Created by **Hanuman Enterprises** for commercial business use.  
All manufacturer logos and product imagery are property of their respective trademark holders.

*Built for speed, security, and sales.* 🚀


---

## 🚀 Key Features

- **Massive Product Catalog:** Over 150+ carefully categorized security products, ranging from basic analog domes to advanced 4G Solar PTZ cameras and 64-Channel NVRs.
- **Interactive Multi-Angle Gallery:** Every product supports a 4-angle image carousel allowing users to view products in high detail.
- **360° Interactive Viewer Integration:** Premium cameras (like TiOC and Solar models) feature an integrated 360-degree interactive viewer UI placeholder.
- **Smart Brand Filtering:** Dynamic rendering and filtering of products based on the manufacturer.
- **Ultra-Fast Performance:** Built on **Vite + React**, ensuring lightning-fast load times even with hundreds of products rendered on-screen.
- **Fully Responsive & Mobile Optimized:** Specifically optimized for single-column mobile view to maximize conversion rates.
- **Direct WhatsApp Integration:** 1-click floating action button connected directly to `+91 9014612983`.

---

## 🛠️ Technology Stack

- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** Custom CSS3 with responsive Grid/Flexbox architecture
- **Database:** Local JSON NoSQL structure (`src/data/products.json`)

---

## 💻 Local Development

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avinashbasani132/hanuman-security-systems.git
   cd hanuman-security-systems
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```text
📦 hanuman-security-systems
 ┣ 📂 public
 ┃ ┣ 📂 images            # All local high-res product and hero images
 ┃ ┗ 📜 favicon.svg
 ┣ 📂 src
 ┃ ┣ 📂 assets
 ┃ ┣ 📂 components        # React UI Components (Hero, Products, Services, etc.)
 ┃ ┣ 📂 data              # Database files
 ┃ ┃ ┗ 📜 products.json   # 150+ Product configurations and specs
 ┃ ┣ 📜 App.jsx           # Main Application Container
 ┃ ┣ 📜 index.css         # Global Styles & Theming (Colors, Grids, Buttons)
 ┃ ┗ 📜 main.jsx          # React DOM Entry
 ┗ 📜 package.json
```

---

## ⚙️ How to Add New Products

Adding new products is incredibly easy. You do not need to write React code.
1. Open `src/data/products.json`.
2. Locate the relevant category (e.g., `cameras`, `dvr`, `accessories`).
3. Add a new JSON object following the schema:
```json
{
  "brand": "CP PLUS",
  "model": "CP-USC-DA24L2",
  "images": [
    "/images/products/cpplus-front.jpg",
    "/images/products/cpplus-side.jpg"
  ],
  "name": "2.4MP Analog HD Dome Camera",
  "type": "Dome / Analog HD",
  "tags": ["2.4MP", "20m IR", "Indoor"],
  "desc": "Cost-effective indoor dome camera.",
  "apps": "Indoor Home, Retail Shop",
  "specs": {
    "Brand": "CP PLUS",
    "Resolution": "2.4MP (1080P)"
  }
}
```

---

## 📄 License & Ownership

Created by Hanuman Enterprises for commercial business use. All manufacturer logos and specific product imagery (CP PLUS, Hikvision, Dahua, EZVIZ, TP-Link, etc.) are the property of their respective trademark holders.

*Built for speed, security, and sales.*
