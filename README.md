# HealthSync - Smart Healthcare Management System

A minimal healthcare management system with authentication using React.js, Node.js, Express.js, and MongoDB Atlas.

## 🚀 Live Demo
- **Frontend**: [Deploy to Vercel](https://vercel.com)
- **Backend**: [Deploy to Render](https://render.com)

## ✨ Features
- 🏠 Homepage with system overview
- 👥 User registration (Patient, Doctor, Admin roles)
- 🔐 User authentication with JWT
- 📊 Protected dashboard
- 🗄️ MongoDB Atlas integration
- 📱 Responsive design

## Setup Instructions

### 1. MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `.env` file

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Update .env file with your MongoDB Atlas credentials
# Replace <username>, <password> in MONGODB_URI
# Set a secure JWT_SECRET

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start React development server
npm start
```

## Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/healthsync?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## API Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Authenticate user

## Deployment
- Frontend: Deploy to Vercel
- Backend: Deploy to Render
- Database: MongoDB Atlas (already cloud-hosted)

## Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Token)