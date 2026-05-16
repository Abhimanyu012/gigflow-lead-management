# GigFlow Lead Management

GigFlow is a full-stack lead management dashboard built with TypeScript, React, Express, MongoDB, and Docker. It provides authentication, lead tracking, role-based access control, dashboard analytics, admin user management, CSV export, and a polished light/dark UI for day-to-day sales operations.

## Overview

This project is organized as a monorepo with two applications:

- `client/` - React + Vite frontend
- `server/` - Express + MongoDB backend

The frontend talks to the backend through a REST API under `/api`. Authentication uses JWTs stored in `localStorage`, and protected routes are enforced both in the UI and on the server.

## Features

- Email/password authentication with registration, login, profile, and logout
- Protected dashboard, leads, profile, and admin routes
- Role-based access control for `admin` and `sales` users
- Lead CRUD with search, filtering, sorting, pagination, and detail view
- Dashboard analytics with recent leads, pipeline counts, and conversion rate
- Admin user management for listing users and changing roles
- CSV export for leads from the UI and API
- Theme toggle with a light and dark experience
- Toast notifications, loading states, confirmations, and responsive layout
- Docker Compose setup for the full stack plus MongoDB

## Screenshots

Below are a few screenshots showcasing the app UI (dark/light views):

- **Login screen**

  ![Login](/docs/screenshots/login.png)

- **Dashboard (dark theme)**

  ![Dashboard dark](/docs/screenshots/dashboard-dark.png)

- **Leads (light theme)**

  ![Leads light](/docs/screenshots/leads-light.png)

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Zustand
- Axios
- React Hook Form
- Zod
- Lucide React icons

### Backend

- Node.js
- Express
- TypeScript
- MongoDB and Mongoose
- JWT authentication
- bcryptjs password hashing
- express-rate-limit
- helmet
- cors
- morgan

## Project Structure

```text
client/
  src/
    api/           # Axios client and API wrappers
    components/    # Shared UI and layout components
    context/       # Auth context
    features/      # Feature-specific forms, cards, tables, and modals
    hooks/         # Data and utility hooks
    pages/         # Route-level screens
    store/         # Zustand stores
    types/         # Frontend types
    utils/         # Formatting and export helpers

server/
  src/
    config/        # Env and DB configuration
    controllers/   # Request handlers
    middleware/    # Auth, validation, permissions, error handling
    models/        # Mongoose models
    routes/        # API routes
    scripts/       # Utility scripts such as admin seeding
    types/         # Shared Express typings
    utils/         # Response, error, async, and JWT helpers
```

## Application Routes

### Frontend routes

- `/` - Redirects to the dashboard
- `/dashboard` - Pipeline overview and recent leads
- `/leads` - Lead management table with filters and actions
- `/profile` - Account profile and sign-out
- `/admin/users` - Admin-only user management
- `/login` - Sign in page
- `/register` - Sign up page
- `/unauthorized` - Access denied page
- `*` - Not found page

### User roles

- `admin` - Full access to dashboards, leads, CSV export, and user management
- `sales` - Lead and dashboard access with restricted admin capabilities

## API Overview

All backend routes are prefixed with `/api`.

### Auth

- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Log in and receive a JWT
- `GET /api/auth/me` - Fetch the current authenticated user

### Leads

- `GET /api/leads` - List leads with search, filters, sort, and pagination
- `GET /api/leads/stats` - Pipeline analytics and summary metrics
- `GET /api/leads/:id` - Fetch a single lead by ID
- `POST /api/leads` - Create a new lead
- `PUT /api/leads/:id` - Update an existing lead
- `DELETE /api/leads/:id` - Delete a lead
- `GET /api/leads/export` - Export leads as CSV, admin only

### Users

- `GET /api/users` - List users, admin only
- `PUT /api/users/:id/role` - Promote or revoke admin access, admin only

### Health

- `GET /health` - Check API status and MongoDB connection state

## Data Model

### User

- `name`
- `email`
- `password`
- `role` - `admin` or `sales`
- timestamps

### Lead

- `name`
- `email`
- `status` - `New`, `Contacted`, `Qualified`, `Lost`
- `source` - `Website`, `Instagram`, `Referral`
- `createdBy`
- timestamps

## Environment Variables

### Server

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Required values:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used to sign JWTs

Optional values:

- `PORT` - Server port, defaults to `5000`
- `JWT_EXPIRES_IN` - JWT lifetime, defaults to `7d`
- `CLIENT_URL` - Allowed frontend origin, defaults to `http://localhost:3000`
- `NODE_ENV` - Environment name, defaults to `development`

### Client

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is not provided, the frontend falls back to `http://localhost:5000/api`.

## Getting Started

### Option 1: Docker Compose

This is the fastest way to run the full stack.

```bash
docker compose up --build
```

Services exposed by default:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Run Locally

#### 1. Start MongoDB

Use a local MongoDB instance or update `MONGO_URI` to point to your own database.

#### 2. Configure the server

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

#### 3. Configure the client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Available Scripts

### Client

```bash
cd client
npm run dev      # Start Vite dev server
npm run build    # Type-check and build for production
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

### Server

```bash
cd server
npm run dev         # Start the API in development mode
npm run build       # Compile TypeScript to dist/
npm run start       # Run the compiled server
npm run seed:admin  # Create or update the default admin user
```

## Admin Seed Script

The backend includes a helper script at `server/src/scripts/seedAdmin.ts`.

It connects to MongoDB, creates a default admin user if one does not exist, or upgrades the existing account to admin if it already exists. The script prints the credentials to the console after it completes.

## Deployment Notes

- The frontend is configured for Vite and can be deployed to any static hosting platform that supports SPA routing.
- The backend can be deployed to any Node.js host with access to MongoDB.
- Update `CLIENT_URL`, `VITE_API_URL`, and `MONGO_URI` for your production environment.
- If you use Docker in production, the provided `docker-compose.yml` and Dockerfiles are already set up for the three-service stack.

## Security and Access Control

- Passwords are hashed with bcrypt before storage.
- API authentication uses Bearer tokens in the `Authorization` header.
- Rate limiting is applied to auth routes.
- `helmet` and `cors` are enabled on the backend.
- Protected routes are guarded in both the frontend and backend.

## Notes

- The frontend API client automatically attaches the stored JWT to requests.
- Unauthenticated or expired sessions are redirected to the login page.
- The app supports both dark and light themes through the UI controls in the header.
