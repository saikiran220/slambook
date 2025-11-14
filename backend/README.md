# Slam Book Backend API

FastAPI backend for the Slam Book application with PostgreSQL database.

## Features

- User authentication (JWT-based)
- CRUD operations for Slam Book entries
- User-specific entries (multi-tenant)
- Tag support for entries
- Favorite entries functionality
- Statistics endpoint
- PostgreSQL database with proper indexing

## Setup Instructions

### 1. Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE slambook_db;
```

2. Update `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/slambook_db
SECRET_KEY=your-secret-key-here
```

3. Run the SQL schema:
```bash
psql -U user -d slambook_db -f database_schema.sql
```

Or let SQLAlchemy create tables automatically (tables will be created on first run).

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/slambook_db

# JWT
SECRET_KEY=your-secret-key-here-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:8080,http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info (protected)

### Entries
- `GET /entries` - Get all entries for current user (protected)
- `GET /entries/{entry_id}` - Get specific entry (protected)
- `POST /entries` - Create new entry (protected)
- `PUT /entries/{entry_id}` - Update entry (protected)
- `DELETE /entries/{entry_id}` - Delete entry (protected)
- `PATCH /entries/{entry_id}/favorite` - Toggle favorite (protected)
- `GET /entries/stats/statistics` - Get statistics (protected)

### Health
- `GET /` - API info
- `GET /health` - Health check

## Database Schema

See `database_schema.sql` for the complete SQL schema.

### Tables

1. **users** - User accounts
   - id (UUID)
   - name, email, hashed_password
   - is_active, created_at, updated_at

2. **entries** - Slam book entries
   - id (UUID)
   - user_id (FK to users)
   - Entry fields (name, nickname, birthday, etc.)
   - tags (array), is_favorite
   - created_at, updated_at

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- User-specific data access (users can only access their own entries)
- CORS configured for frontend origins

## Testing

Test the API using the Swagger UI at `/docs` or with curl:

```bash
# Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get entries (replace TOKEN with actual token)
curl -X GET http://localhost:8000/entries \
  -H "Authorization: Bearer TOKEN"
```

