# HealthSync Deployment Guide

Complete guide for deploying HealthSync to **Render** (backend) and **Vercel** (frontend).

---

## 🔹 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Create `.env` file** in `backend/` directory:
```bash
PORT=5001
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/healthsync"
JWT_SECRET="your-super-secure-jwt-secret-key"
NODE_ENV=production
```

2. **Test locally first**:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `healthsync-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

5. **Add Environment Variables**:
   - `DATABASE_URL` - Your MySQL connection string
   - `JWT_SECRET` - A strong random string
   - `PORT` - `5001` (or leave default)
   - `NODE_ENV` - `production`

6. Click **"Create Web Service"**

7. **Note your backend URL**: `https://healthsync-backend.onrender.com` (or your custom domain)

---

## 🔹 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Create `.env` file** in `frontend/` directory:
```bash
REACT_APP_API_BASE_URL="https://your-backend-url.onrender.com/api"
```

2. **Update `frontend/src/services/api.js`** if needed to use environment variable (already configured).

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. **Add Environment Variable**:
   - `REACT_APP_API_BASE_URL` - Your Render backend URL + `/api`
     - Example: `https://healthsync-backend.onrender.com/api`

6. Click **"Deploy"**

7. **Note your frontend URL**: `https://your-app.vercel.app`

---

## 🔹 Database Setup Options

### Option 1: MySQL on Render (Recommended)

1. In Render Dashboard, create **"PostgreSQL"** or use external MySQL service
2. For MySQL, use services like:
   - **PlanetScale** (free tier available)
   - **AWS RDS**
   - **DigitalOcean Managed Database**
   - **Railway** (MySQL support)

3. Get connection string and add to `DATABASE_URL` in Render environment variables

### Option 2: Local MySQL (Development Only)

```bash
# Install MySQL locally
# Create database
mysql -u root -p
CREATE DATABASE healthsync;
exit

# Update DATABASE_URL in .env
DATABASE_URL="mysql://root:password@localhost:3306/healthsync"
```

---

## 🔹 Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads correctly
- [ ] Login/Signup works
- [ ] API calls from frontend succeed (check browser console)
- [ ] CORS is enabled (already configured in backend)
- [ ] Environment variables are set correctly

---

## 🔹 Troubleshooting

### Backend Issues

- **Database connection fails**: Check `DATABASE_URL` format and credentials
- **Prisma errors**: Ensure `npx prisma generate` runs in build command
- **Port issues**: Render assigns port automatically, use `process.env.PORT`

### Frontend Issues

- **API calls fail**: Check `REACT_APP_API_BASE_URL` is correct
- **CORS errors**: Backend CORS is configured, but verify Render URL is allowed
- **Build fails**: Check Node version compatibility

---

## 🔹 Environment Variables Summary

### Backend (.env)
```bash
PORT=5001
DATABASE_URL="mysql://user:pass@host:3306/healthsync"
JWT_SECRET="your-secret-key"
NODE_ENV=production
```

### Frontend (.env)
```bash
REACT_APP_API_BASE_URL="https://your-backend.onrender.com/api"
```

---

## 🔹 Quick Start Commands

### Local Development

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🔹 Production URLs

After deployment, update:
- Frontend `.env`: Point to production backend URL
- Backend CORS: Add frontend Vercel URL if needed (already configured for all origins)

---

**Deployment Complete! 🎉**

