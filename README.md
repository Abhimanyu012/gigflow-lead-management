# Smart Leads Dashboard (GigFlow)

A production-ready, full-stack Lead Management Dashboard built using the MERN stack with clean architecture, scalable code practices, and a professional, premium glassmorphic user experience. This project fulfills all requirements for the MERN Internship Assignment.

## 🚀 Compliance Checklist (Assignment Requirements)

| Requirement | Status | Implementation Detail |
| :--- | :--- | :--- |
| **Authentication** | ✅ Done | JWT-based with bcrypt hashing, protected routes, and auth middleware. |
| **CRUD Operations** | ✅ Done | Full Name, Email, Status, Source management with dedicated modals. |
| **View Details** | ✅ Done | Integrated read-only detail view within a high-end modal interface. |
| **Advanced Filtering** | ✅ Done | Combined filters for Status, Source, and Search (Name/Email) with Backend Sorting. |
| **Pagination** | ✅ Done | Mandatory backend-driven skip/limit with metadata in API response (10 per page). |
| **Tech Stack** | ✅ Done | Strict TypeScript (Frontend & Backend), React, Node, Express, MongoDB. |
| **Responsive UI** | ✅ Done | Mobile-first premium glassmorphic design with TailwindCSS. |
| **API Standards** | ✅ Done | RESTful, centralized error handling, and robust Zod request validation. |
| **Docker Setup** | ✅ Done | Multi-container Docker Compose setup for instant deployment. |
| **CSV Export** | ✅ Done | Admin-only CSV export functionality for all filtered leads. |
| **RBAC** | ✅ Done | Distinct "Admin" and "Sales" roles with strict backend data scoping. |
| **Debounced Search** | ✅ Done | Custom hook implementation to optimize API calls during search. |
| **Dark Mode** | ✅ Done | (Bonus) Seamless system-level dark mode support. |

## 🛠️ Tech Stack
- **Frontend**: React.js, TypeScript, TailwindCSS, Zustand (State), React Hook Form, Zod
- **Backend**: Node.js, Express.js, TypeScript, MongoDB + Mongoose, JWT, bcrypt
- **DevOps**: Docker, Docker Compose

## 🔑 Default Admin Credentials
To test the global administrative features (global stats, export, etc.), use the following seeded account:
- **Email**: `admin@gigflow.com`
- **Password**: `AdminPassword123!`

## 📦 Setup Instructions

### 1. Using Docker (Recommended)
```bash
docker-compose up --build
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 2. Manual Setup
**Backend:**
```bash
cd server && npm install && npm run dev
```
**Frontend:**
```bash
cd client && npm install && npm run dev
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

## ☁️ Deployment Guide

### 1. Backend (Render)
1.  **Create a New Web Service** on Render and connect your GitHub repo.
2.  **Root Directory**: `server`
3.  **Build Command**: `npm install && npm run build`
4.  **Start Command**: `node dist/index.js`
5.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A long, secure random string.
    *   `NODE_ENV`: `production`
    *   `CLIENT_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`).

### 2. Frontend (Vercel)
1.  **Create a New Project** on Vercel and connect your GitHub repo.
2.  **Root Directory**: `client`
3.  **Framework Preset**: `Vite`
4.  **Environment Variables**:
    *   `VITE_API_URL`: Your Render backend URL (e.g., `https://your-api.onrender.com`).
5.  **Note**: The included `vercel.json` will automatically handle SPA routing for you.

---
*Created with ❤️ for the ServiceHive MERN Internship Assignment.*
