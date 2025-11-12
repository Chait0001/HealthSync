# Quick Start Guide

## Option 1: Run Both Servers at Once
```bash
./start.sh
```

## Option 2: Run Manually

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend (in new terminal):
```bash
cd frontend
npm install
npm start
```

## Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/test

## Fix Database Connection
1. Update `backend/.env` file:
   - Replace `<username>` and `<password>` with your MongoDB Atlas credentials
2. Restart backend server

## Test Without Database
The application will run without MongoDB connection but show database error messages when trying to signup/login.