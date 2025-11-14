# Render Deployment Guide - Backend API

## Step-by-Step Instructions for Deploying Backend on Render

### Service Type Configuration

**Service Type:** `Web Service` ✓

---

### Basic Settings

**Name:** 
```
slam-buddy-backend
```
(Or any unique name you prefer)

**Language:**
```
Python 3
```
⚠️ **Important:** Change from "Node" to "Python 3" - Render detected Node.js because of the frontend folder, but the backend is Python!

**Branch:**
```
main
```
(Or your default branch name)

**Region:**
```
Oregon (US West)
```
(Or your preferred region)

**Root Directory:**
```
backend
```
⚠️ **Important:** Set this to `backend` so Render knows to deploy from the backend folder, not the root!

---

### Build & Deploy Settings

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn wsgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 2 --timeout 30
```
⚠️ **Important:** Replace the default `gunicorn your_application.wsgi` with the command above!

**Health Check Path:**
```
/health
```

---

### Environment Variables

Add these in the "Environment" section:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname` | Get from Render PostgreSQL service |
| `SECRET_KEY` | `[Generate with: openssl rand -hex 32]` | Use a strong random string |
| `CORS_ORIGINS` | `https://your-frontend-app.onrender.com` | Your frontend URL(s), comma-separated |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiration time |

**Generate SECRET_KEY:**
```bash
openssl rand -hex 32
```

---

### Database Setup

1. **Create PostgreSQL Database:**
   - In Render Dashboard, click "New +" → "PostgreSQL"
   - Choose plan and region
   - Copy the **Internal Database URL** for `DATABASE_URL`

2. **Update Database Schema:**
   - The tables will be created automatically on first run (via SQLAlchemy)
   - Or manually run `database_schema.sql` if needed

---

### Advanced Settings

**Auto-Deploy:** `Yes` (deploys on git push)

**Dockerfile Path:** Leave empty (using build command)

---

## Quick Checklist

- [ ] Service Type: Web Service
- [ ] Language: **Python 3** (not Node!)
- [ ] Root Directory: **backend**
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn wsgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --workers 2 --timeout 30`
- [ ] Health Check Path: `/health`
- [ ] Environment Variables: DATABASE_URL, SECRET_KEY, CORS_ORIGINS set
- [ ] PostgreSQL database created and connected

---

## Troubleshooting

### Common Issues:

1. **"Module not found" errors:**
   - Make sure Root Directory is set to `backend`
   - Verify `requirements.txt` includes all dependencies

2. **Database connection errors:**
   - Use Internal Database URL from Render PostgreSQL
   - Check DATABASE_URL environment variable is set correctly

3. **CORS errors from frontend:**
   - Add your frontend URL to CORS_ORIGINS
   - Include both `http://localhost:8080` for local dev and production URL

4. **Port binding errors:**
   - Make sure to use `$PORT` in the start command (Render sets this automatically)

---

## Testing After Deployment

1. Check health endpoint: `https://your-backend.onrender.com/health`
2. View API docs: `https://your-backend.onrender.com/docs`
3. Test authentication: `https://your-backend.onrender.com/auth/signup`

---

## Frontend Deployment (Separate Service)

For the frontend React app, create a **separate Web Service**:

- **Service Type:** Web Service
- **Language:** Node
- **Root Directory:** (leave empty - deploy from root)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run preview` or use a static file server
- **Environment Variable:** `VITE_API_BASE_URL` = `https://your-backend.onrender.com`

