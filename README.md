# HealthSync - Smart Healthcare Management System

Full-stack **HealthSync** application:

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, Prisma (MySQL)
- **Auth**: JWT with role-based access (`ADMIN`, `DOCTOR`, `PATIENT`)

## ✨ Features
- 🏠 Home, Login, Signup, Dashboard, Profile pages
- 👥 User registration & login with secure password hashing
- 🔐 JWT authentication and protected routes
- 🏥 CRUD for Patients, Doctors, Appointments
- 🔎 Search, sorting, filtering, and pagination on all list views

## Backend Setup (MySQL + Prisma)

```bash
cd backend
npm install
```

Create a `.env` in `backend`:

```bash
PORT=5001
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/healthsync"
JWT_SECRET="super-secure-jwt-secret-change-me"
```

Then generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The Prisma schema (tables: `User`, `Patient`, `Doctor`, `Appointment`) is defined in `backend/prisma/schema.prisma`.

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` in `frontend`:

```bash
REACT_APP_API_BASE_URL="http://localhost:5001/api"
```

Start the React dev server:

```bash
npm start
```

## API Overview

- `POST /api/auth/signup` – Register user (role: `ADMIN`, `DOCTOR`, or `PATIENT`)
- `POST /api/auth/login` – Login, returns `{ token, user }`
- `GET /api/patients` – List patients with `search`, `sortBy`, `order`, `page`, `limit`, `doctor`
- `GET /api/doctors` – List doctors with `search`, `department`, `sortBy`, `order`, `page`, `limit`
- `GET /api/appointments` – List appointments with `search`, `status`, `doctor`, `patient`, `date/dateFrom/dateTo`, `sortBy`, `order`, `page`, `limit`

List responses use the shape:

```json
{
  "data": [/* items */],
  "totalPages": 5,
  "currentPage": 1,
  "totalItems": 100
}
```

## Deployment

- **Backend (Render)**:
  - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
  - Start command: `npm start`
  - Environment: `DATABASE_URL`, `JWT_SECRET`, `PORT`
- **Frontend (Vercel)**:
  - Set `REACT_APP_API_BASE_URL` to your Render backend URL (e.g. `https://your-api.onrender.com/api`)
