# 🎬 MV ProShoot — Real-Time Slot Booking & 3D Stage Platform

A full-stack, real-time photography & music video (MV) studio slot booking platform engineered with **React.js**, **Three.js**, **Express.js**, **MongoDB Atlas**, **JWT Authentication**, and **Socket.io**.

---

## 🌟 Key Features

- **🎨 3D Interactive Landing Page**: Dynamic Three.js WebGL canvas featuring an iridescent camera aperture lens rig, refractive optical core, and 1,400+ floating palette bokeh particles responsive to mouse movement.
- **⚡ Real-Time Slot Sync via Socket.io**: Instant multi-client slot status synchronization. When any user holds or books a slot, all connected browsers update immediately without refreshing.
- **⏱️ 3-Minute Hold Lock Engine**: Prevents double-booking by temporarily reserving a slot while the client reviews and confirms their shoot details.
- **🔐 JWT Authentication**: Stateless access tokens, password hashing with bcrypt, role-based protection (`user` vs `admin`).
- **📅 Studio Bay Management**: Stages A (Cyberpunk & Neon), B (High-Key Gold & Softbox), and C (Cinematic MV Turntable).
- **🛡️ Admin Operations Bay**: Real-time management to create new slots across dates, adjust peak-hour pricing multipliers, and inspect all studio reservations.

---

## 🚀 Quick Start

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed   # Seeds MongoDB Atlas with services, users, and slots
npm run dev    # Starts API and Socket.io on http://localhost:5000
```

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev    # Starts Vite dev server on http://localhost:5173
```

---

## 🔑 Demo Accounts (Pre-seeded in MongoDB Atlas)

| Role | Email | Password |
|------|-------|----------|
| **Admin (Director)** | `admin@mvproshoot.com` | `password123` |
| **Client** | `client@mvproshoot.com` | `password123` |

*(You can also use the 1-click **Demo Admin** or **Demo Client** buttons in the Sign In modal!)*

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get authenticated user profile (`Bearer <token>`)

### Photography Services (`/api/services`)
- `GET /api/services` — Fetch all studio packages (MV shoot, editorial, portraits)
- `POST /api/services` — Admin: Create new package

### Real-Time Slots (`/api/slots`)
- `GET /api/slots?date=YYYY-MM-DD` — Get all slots for a given date
- `POST /api/slots/:id/hold` — Temporarily lock a slot for 3 minutes
- `POST /api/slots/:id/release` — Release held slot back to available pool
- `POST /api/slots/:id/book` — Confirm and book slot with shoot details
- `GET /api/slots/my-bookings` — Get authenticated user's reservations
- `POST /api/slots` — Admin: Publish new studio slot
- `GET /api/slots/admin/all-bookings` — Admin: View all studio bookings
