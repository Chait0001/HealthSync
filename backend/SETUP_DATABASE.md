# Quick Database Setup for HealthSync

## Step 1: Update DATABASE_URL in .env

Edit `backend/.env` and update the `DATABASE_URL` with your MySQL credentials:

```bash
DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/healthsync"
```

**Common scenarios:**

### If you don't have a MySQL password:
```bash
DATABASE_URL="mysql://root@localhost:3306/healthsync"
```

### If your MySQL password is different:
```bash
DATABASE_URL="mysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/healthsync"
```

### If you use a different MySQL user:
```bash
DATABASE_URL="mysql://username:password@localhost:3306/healthsync"
```

## Step 2: Create the Database

Run this in MySQL:

```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS healthsync;
EXIT;
```

## Step 3: Run Prisma Migrations

```bash
cd backend
npx prisma migrate dev --name init
```

This will create all the tables (User, Patient, Doctor, Appointment).

## Step 4: Restart Backend

```bash
npm run dev
```

Test: `curl http://localhost:5001/api/health`

---

**Quick Test MySQL Connection:**

```bash
mysql -u root -p -e "SHOW DATABASES;"
```

If this works, use the same username and password in your DATABASE_URL.

