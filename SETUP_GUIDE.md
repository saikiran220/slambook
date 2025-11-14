# Slam Book Application - Setup Guide

Complete setup guide for the full-stack Slam Book application.

## Prerequisites

### Backend
- Python 3.9 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

### Frontend
- Node.js 18 or higher
- npm or yarn

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up PostgreSQL Database

#### Create Database
```sql
CREATE DATABASE slambook_db;
```

#### Create User (Optional)
```sql
CREATE USER slambook_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE slambook_db TO slambook_user;
```

### 5. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/slambook_db

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

**To generate a secure SECRET_KEY:**
```bash
# Using OpenSSL
openssl rand -hex 32
```

### 6. Initialize Database

#### Option 1: Using SQL Schema (Recommended)
```bash
psql -U user -d slambook_db -f database_schema.sql
```

#### Option 2: Let SQLAlchemy Create Tables
Tables will be created automatically on first server start.

### 7. Run the Backend Server

```bash
# Development mode (with auto-reload)
python run.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend Setup

### 1. Navigate to Project Root
```bash
cd ..  # If you're in backend directory
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API URL

Create a `.env` file in the project root (optional):

```env
VITE_API_BASE_URL=http://localhost:8000
```

Or the frontend will use `http://localhost:8000` by default.

### 4. Run the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:8080` (or the port specified in vite.config.ts)

## Testing the Application

### 1. Backend Health Check
```bash
curl http://localhost:8000/health
```

### 2. Test Signup
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Frontend Testing

1. Open `http://localhost:8080` in your browser
2. You should be redirected to `/login` if not authenticated
3. Create an account using the signup page
4. After login, you'll be redirected to the home page
5. Try creating an entry and managing your slam book entries

## Production Deployment

### Backend

1. Set secure environment variables in production
2. Use a production ASGI server:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```
3. Set up reverse proxy (nginx) if needed
4. Configure SSL/TLS certificates

### Frontend

1. Build for production:
```bash
npm run build
```

2. Serve the `dist` folder using a web server (nginx, Apache, etc.)

3. Update CORS_ORIGINS in backend `.env` to include production frontend URL

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env` is correct
- Ensure database exists

**Import Errors:**
- Make sure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**Port Already in Use:**
- Change port in `run.py` or use `--port` flag with uvicorn

### Frontend Issues

**Cannot Connect to Backend:**
- Verify backend is running on `http://localhost:8000`
- Check CORS_ORIGINS in backend `.env`
- Verify VITE_API_BASE_URL in frontend `.env`

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

### Authentication Issues

**Token Not Working:**
- Check SECRET_KEY is set correctly
- Verify JWT expiration time
- Check token is being sent in Authorization header

**401 Unauthorized:**
- Token may have expired - try logging in again
- Check token is stored correctly in localStorage
- Verify backend is receiving the token

## Development Tips

1. **Backend Auto-reload:** The server auto-reloads on code changes in development mode
2. **Frontend Hot Reload:** Vite provides instant hot module replacement
3. **API Testing:** Use Swagger UI at `/docs` for interactive API testing
4. **Database Management:** Use pgAdmin or psql for database management
5. **Debugging:** Check browser console and backend logs for errors

## Project Structure

See `PROJECT_STRUCTURE.md` for detailed project structure and architecture.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend/README.md and backend documentation
3. Check API documentation at `/docs` when backend is running

