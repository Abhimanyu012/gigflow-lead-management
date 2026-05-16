# GigFlow Lead Management

A production-ready full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript.

---

## Getting Started

### 1. Using Docker (Recommended)
To start both the client (frontend) and server (backend) with Docker Compose:
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

### 2. Manual Setup

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

---

## Tech Stack

- **Frontend:** React.js (TypeScript), TailwindCSS, Zustand
- **Backend:** Node.js, Express.js (TypeScript), MongoDB, Mongoose

---

## Environment Variables

### Backend (`server/.env`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT authentication
- `NODE_ENV`: ("development" or "production")
- `CLIENT_URL`: Frontend URL

### Frontend (`client/.env`)
- `VITE_API_URL`: Backend API endpoint

---

For further details on API routes or deployment, check the respective `client` and `server` folders.

---
```

## 📖 API Documentation

All endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` in the `Authorization` header.

### Auth
- `POST /auth/register` - User signup
- `POST /auth/login` - User login (returns JWT)
- `GET /auth/me` - Get current user profile

### Leads
- `GET /leads` - List leads (paginated/filtered)
- `GET /leads/stats` - Pipeline analytics
- `GET /leads/:id` - View single lead details
- `POST /leads` - Create lead
- `PUT /leads/:id` - Update lead
- `DELETE /leads/:id` - Delete lead
- `GET /leads/export` - Export to CSV (Admin Only)

---


