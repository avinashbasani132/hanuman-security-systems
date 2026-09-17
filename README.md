# Hanuman Enterprises Security Systems

A premium, modern, and highly responsive React e-commerce platform for CCTV & Security Systems. 

🌍 **Live Demo:** [hanuman-security-systems.vercel.app](https://hanuman-security-systems.vercel.app) 

## 🚀 Key Features
- **Modern E-Commerce UI:** A stunning, animated, and responsive user interface built from the ground up to provide a premium shopping experience.
- **Dedicated Brand Pages:** Browse products from top security brands like CP PLUS, Hikvision, Dahua, Axis, EZVIZ, and TP-Link in their own dedicated showcases.
- **Mobile OTP Authentication:** Integrated with Supabase Auth for Amazon-style Phone Number and OTP login (with Email fallback).
- **Multi-Step Checkout & Saved Addresses:** Logged-in users can save their delivery addresses securely in the database and select them with one click during checkout.
- **WhatsApp Order Integration:** After selecting an address and confirming the order summary, the checkout process instantly routes the formatted order directly to a designated WhatsApp business number.
- **Dynamic Product Pages:** Detailed specifications, 360-degree image views, dynamic cart integration, and an intelligent "Similar Products" recommendation engine.
- **Global Cart State:** A fully robust shopping cart system with quantity management using the React Context API.
- **Account Dashboard:** A "My Account" page where users can view their past orders and manage their saved delivery addresses.
- **Live Search:** Instant search functionality filtering through names, models, brands, and tags.

## 🛠 Tech Stack & Models
- **Frontend Framework:** React 18, Vite
- **Styling:** Custom Vanilla CSS (`index.css`) utilizing advanced Flexbox, CSS Grid, and Glassmorphism effects.
- **Backend & Database:** Supabase (PostgreSQL, GoTrue Auth)
- **State Management:** React Context API (`AuthContext`, `CartContext`)
- **Routing:** Hash-based client-side routing (for maximum compatibility)
- **Deployment:** Vercel (Frontend configuration included via `vercel.json`)

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/avinashbasani132/hanuman-security-systems.git
   ```
2. Navigate into the frontend directory:
   ```bash
   cd hanuman-security-systems/frontend
   ```
3. Install the frontend dependencies:
   ```bash
   npm install
   ```
4. Set up Environment Variables:
   Create a `.env` file in the `frontend` folder and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running Locally
To start the React development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Database Setup
To set up the required Supabase tables for Authentication, Orders, and Addresses, run the SQL script provided in `launch_guide.md` within your Supabase SQL Editor.

## 🎨 Design System
The application utilizes a custom design system focusing on:
- Soft shadows (`box-shadow: 0 10px 40px rgba(...)`)
- Smooth micro-interactions and hover states
- Modern typography (`Outfit` and system sans-serif fonts)
- A professional color palette combining clean whites (`#fff`), soft backgrounds (`#f8f9fc`), and an energetic accent color (`#ff4a00`).

## 🤝 Contribution
Feel free to open issues or submit pull requests if you would like to contribute!

---
*Built with precision and a focus on premium aesthetics by Antigravity.*
