# Slam Book Application - Project Structure

## Overview
A full-stack Slam Book application with React frontend and FastAPI backend, featuring user authentication, CRUD operations, and data persistence.

## Project Structure

```
slam-buddy-app-main/
├── backend/                  # Python FastAPI Backend
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration and settings
│   ├── database.py          # Database connection and session management
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for request/response validation
│   ├── auth.py              # Authentication utilities (JWT, password hashing)
│   ├── database_schema.sql  # SQL schema for PostgreSQL
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   ├── .gitignore
│   ├── run.py               # Server run script
│   └── README.md            # Backend documentation
│
├── src/                      # React Frontend
│   ├── components/          # Reusable React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── EntryCard.tsx   # Entry card component
│   │   └── ProtectedRoute.tsx  # Route protection component
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   └── useEntries.ts   # Entries data management hook
│   │
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts          # Axios API client configuration
│   │   ├── api-service.ts  # API service layer
│   │   ├── entry-service.ts # Legacy localStorage service (deprecated)
│   │   ├── validations.ts  # Zod validation schemas
│   │   └── utils/          # Utility functions
│   │       ├── date.ts     # Date formatting utilities
│   │       └── export.ts   # Export/import utilities
│   │
│   ├── pages/               # Page components
│   │   ├── Home.tsx        # Home page with statistics
│   │   ├── Login.tsx       # Login page
│   │   ├── Signup.tsx      # Signup page
│   │   ├── CreateEntry.tsx # Create/Edit entry page
│   │   ├── EntriesList.tsx # Entries list page
│   │   ├── EntryDetail.tsx # Entry detail page
│   │   └── NotFound.tsx    # 404 page
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── slambook.ts     # Slam book entry types
│   │
│   ├── utils/               # Legacy utilities (deprecated)
│   │   └── localStorage.ts # localStorage utilities
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
│
├── public/                   # Static assets
├── package.json             # Node.js dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── README.md                # Project documentation
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **TanStack Query (React Query)** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Shadcn UI** - UI component library
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **Python-JOSE** - JWT handling
- **Passlib** - Password hashing (bcrypt)
- **Uvicorn** - ASGI server

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `hashed_password` (VARCHAR)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Entries Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to users)
- `name`, `nickname`, `birthday`, `contact_number` (Entry fields)
- `likes`, `dislikes`, `favorite_movie`, `favorite_food` (Optional fields)
- `about`, `message` (Text fields)
- `tags` (TEXT[] - Array of strings)
- `is_favorite` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

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

## Setup Instructions

### Backend Setup
1. Install Python 3.9+
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Set up PostgreSQL database
4. Configure `.env` file in backend directory
5. Run database migrations or execute `database_schema.sql`
6. Start server: `python backend/run.py`

### Frontend Setup
1. Install Node.js 18+
2. Install dependencies: `npm install`
3. Configure API URL in `.env` or `vite.config.ts`
4. Start dev server: `npm run dev`

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- User session management
- Password hashing with bcrypt

### Entry Management
- Create, read, update, delete entries
- Favorite/unfavorite entries
- Tag support
- Search and filter functionality
- Export/import JSON
- Statistics dashboard

### Data Persistence
- PostgreSQL database
- User-specific data isolation
- Automatic timestamps
- Database indexes for performance

## Security Features
- Password hashing
- JWT token authentication
- User-specific data access
- CORS configuration
- Input validation
- SQL injection protection (SQLAlchemy ORM)

