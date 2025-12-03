# HealthSync Setup Guide

Complete setup instructions for running HealthSync locally.

---

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher) - or use a cloud MySQL service
- **npm** or **yarn**

---

## 🔹 Step 1: Database Setup

### Option A: Local MySQL

1. **Install MySQL** (if not already installed)
   - macOS: `brew install mysql`
   - Windows: Download from [MySQL website](https://dev.mysql.com/downloads/)
   - Linux: `sudo apt-get install mysql-server`

2. **Start MySQL service**
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

3. **Create database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE healthsync;
   EXIT;
   ```

### Option B: Cloud MySQL (Recommended for Production)

Use services like:
- **PlanetScale** (free tier)
- **AWS RDS**
- **DigitalOcean Managed Database**
- **Railway**

Get your connection string in the format:
```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

---

## 🔹 Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   # Copy the example (if available) or create manually
   touch .env
   ```

4. **Add environment variables to `.env`**
   ```bash
   PORT=5001
   DATABASE_URL="mysql://root:password@localhost:3306/healthsync"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   NODE_ENV=development
   ```
   
   **Important**: Replace `root:password` with your MySQL credentials.

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```
   
   This will:
   - Create all tables (User, Patient, Doctor, Appointment)
   - Set up relationships and indexes

7. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   The server should start on `http://localhost:5001`
   
8. **Test the API**
   ```bash
   curl http://localhost:5001/api/health
   ```
   
   Should return: `{"status":"ok","database":"connected"}`

---

## 🔹 Step 3: Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   touch .env
   ```

4. **Add environment variable to `.env`**
   ```bash
   REACT_APP_API_BASE_URL="http://localhost:5001/api"
   ```

5. **Start the React development server**
   ```bash
   npm start
   ```
   
   The app should open in your browser at `http://localhost:3000`

---

## 🔹 Step 4: Verify Setup

1. **Backend is running**: Check `http://localhost:5001/api/health`
2. **Frontend is running**: Check `http://localhost:3000`
3. **Test signup**: Go to `/signup` and create an account
4. **Test login**: Log in with your credentials
5. **Test dashboard**: You should see your role-specific dashboard

---

## 🔹 Creating Test Users

### Via Signup Page

1. Go to `http://localhost:3000/signup`
2. Fill in the form:
   - Name: `Admin User`
   - Email: `admin@test.com`
   - Password: `admin123`
   - Role: `ADMIN`
3. Click "Sign Up"
4. You'll be redirected to the Admin Dashboard

### Via API (using curl)

```bash
# Create Admin User
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "ADMIN"
  }'

# Create Doctor
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "doctor@test.com",
    "password": "doctor123",
    "role": "DOCTOR"
  }'

# Create Patient
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "patient@test.com",
    "password": "patient123",
    "role": "PATIENT"
  }'
```

---

## 🔹 Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solutions**:
- Verify MySQL is running: `mysql -u root -p`
- Check `DATABASE_URL` in `.env` is correct
- Ensure database `healthsync` exists
- Check MySQL user has proper permissions

### Prisma Issues

**Error**: `Prisma Client has not been generated yet`

**Solution**:
```bash
cd backend
npx prisma generate
```

**Error**: `Migration failed`

**Solution**:
```bash
cd backend
npx prisma migrate reset  # WARNING: This deletes all data
npx prisma migrate dev --name init
```

### Port Already in Use

**Error**: `Port 5001 is already in use`

**Solution**:
- Change `PORT` in `backend/.env` to another port (e.g., `5002`)
- Update `REACT_APP_API_BASE_URL` in `frontend/.env` accordingly

### CORS Issues

**Error**: `CORS policy blocked`

**Solution**:
- Backend CORS is already configured to allow all origins
- If issues persist, check backend is running and URL is correct

---

## 🔹 Project Structure

```
HealthSync-Project/
├── backend/
│   ├── config/
│   │   └── prismaClient.js      # Prisma client instance
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── patientController.js  # Patient CRUD
│   │   ├── doctorController.js   # Doctor CRUD
│   │   └── appointmentController.js # Appointment CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # Role-based access
│   │   └── errorHandler.js       # Error handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── appointmentRoutes.js
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── utils/
│   │   └── generateToken.js      # JWT generation
│   ├── server.js                 # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── PatientDashboard.js
│   │   │   ├── ManagePatients.js
│   │   │   ├── ManageDoctors.js
│   │   │   ├── ManageAppointments.js
│   │   │   ├── Profile.js
│   │   │   └── NotFound.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   └── App.js                # Router setup
│   └── package.json
├── README.md
├── SETUP.md                      # This file
└── DEPLOYMENT.md
```

---

## 🔹 Next Steps

1. ✅ Backend and frontend are running
2. ✅ Create test users
3. ✅ Explore the dashboards
4. ✅ Test CRUD operations
5. ✅ Test search, sort, filter, pagination
6. 📖 Read `DEPLOYMENT.md` for production deployment

---

## 🔹 Quick Commands Reference

### Backend
```bash
cd backend
npm install              # Install dependencies
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npm run dev              # Start dev server
npm start                # Start production server
```

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm start                # Start dev server
npm run build            # Build for production
```

---

**Setup Complete! 🎉**

You're ready to use HealthSync. If you encounter any issues, check the Troubleshooting section above.

