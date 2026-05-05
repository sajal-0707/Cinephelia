# 🎬 Movie Ticket Booking — Backend API

A production-ready Node.js + Express REST API for a movie ticket booking platform.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Authentication** | Google OAuth 2.0 via Passport.js |
| **Session storage** | MongoDB-backed (connect-mongo) |
| **User profiles** | Name, phone, city/state/country, Gmail, avatar |
| **Movies API** | List (paginated + search), detail, showtimes |
| **Seat selection** | Live seat-map per showtime (10×10 grid) |
| **Booking logic** | Atomic reservation with MongoDB transactions |
| **Booking ID** | Human-readable unique ID (`BK-XXXXXXXX`) |
| **Cancellation** | Releases seats back to showtime atomically |
| **Database** | MongoDB 6+ with Mongoose ODM |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB 6+ running locally **or** a MongoDB Atlas connection string
- A Google Cloud project with OAuth 2.0 credentials

### 2. Install
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Start
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

---

## ⚙️ Environment Variables

See `.env.example` for all variables with explanations.

**Required:**
- `MONGODB_URI` — MongoDB connection string
- `SESSION_SECRET` — Random string (≥ 32 chars) for signing sessions
- `GOOGLE_CLIENT_ID` — From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `GOOGLE_CALLBACK_URL` — Must match what you registered in Google Console
- `CLIENT_URL` — Your frontend URL (for CORS + OAuth redirects)

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/google` | Start Google OAuth flow |
| `GET` | `/api/auth/google/callback` | OAuth callback (handled by Google) |
| `GET` | `/api/auth/me` | Get current user (401 if not logged in) |
| `POST` | `/api/auth/logout` | Destroy session |

---

### Users (🔒 requires login)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get own profile |
| `PUT` | `/api/users/profile` | Update name / phone / location |
| `GET` | `/api/users/bookings` | List all bookings by the user |

**Update profile body:**
```json
{
  "name": "John Doe",
  "phone": "+91-9876543210",
  "location": { "city": "Mumbai", "state": "Maharashtra", "country": "India" }
}
```

---

### Movies (public)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies` | List movies (paginated) |
| `GET` | `/api/movies/:id` | Movie detail |
| `GET` | `/api/movies/:id/showtimes` | Upcoming showtimes |
| `GET` | `/api/movies/:id/showtimes/:stId/seats` | Seat map for a showtime |

**List movies query params:** `search`, `genre`, `language`, `page`, `limit`

**Seat map response example:**
```json
{
  "success": true,
  "showtime": { "hall": "IMAX", "ticketPrice": 450, "available": 147 },
  "seats": [
    { "label": "A1", "row": "A", "col": 1, "status": "booked" },
    { "label": "A2", "row": "A", "col": 2, "status": "available" }
  ]
}
```

---

### Bookings (🔒 requires login)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings/:bookingId` | Get booking by `BK-XXXXXXXX` |
| `POST` | `/api/bookings/:bookingId/cancel` | Cancel booking |

**Create booking body:**
```json
{
  "movieId": "<movie _id>",
  "showtimeId": "<showtime _id>",
  "seats": ["A3", "A4", "A5"]
}
```

**Confirmation response:**
```json
{
  "success": true,
  "message": "Booking confirmed!",
  "booking": {
    "bookingId": "BK-3F9A12BC",
    "status": "confirmed",
    "seats": ["A3", "A4", "A5"],
    "totalAmount": 1350,
    "showtimeSnapshot": {
      "date": "2025-06-15T00:00:00.000Z",
      "time": "18:30",
      "hall": "IMAX",
      "ticketPrice": 450
    },
    "movie": { "title": "Iron Phantom", "posterUrl": "..." },
    "user": { "name": "John Doe", "email": "john@gmail.com" }
  }
}
```

---

## 🗂️ Project Structure

```
src/
├── server.js              # Entry point
├── app.js                 # Express app + middleware
├── config/
│   ├── db.js              # Mongoose connection
│   └── passport.js        # Google OAuth strategy
├── models/
│   ├── user.model.js
│   ├── movie.model.js     # Includes embedded showtimes
│   └── booking.model.js
├── controllers/
│   ├── user.controller.js
│   ├── movie.controller.js
│   └── booking.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── movie.routes.js
│   └── booking.routes.js
├── middlewares/
│   └── auth.middleware.js # isAuthenticated guard
└── utils/
    └── seeder.js          # Sample data
```

---

## 🔒 Concurrency Safety

Seat reservations use **MongoDB transactions** (`startSession` + `startTransaction`).
The atomic `findOneAndUpdate` with a `$not $elemMatch` guard ensures two simultaneous
requests can never book the same seat — one will receive a `409 Conflict` response.

> **Requires** a MongoDB replica set or Atlas cluster (transactions are not supported
> on standalone `mongod`). For local dev, run a single-node replica set:
> ```bash
> mongod --replSet rs0
> # then in another terminal:
> mongosh --eval "rs.initiate()"
> ```

---

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Application type: Web application)
3. Add `http://localhost:5000/api/auth/google/callback` to **Authorised redirect URIs**
4. Copy the Client ID and Secret into your `.env`
