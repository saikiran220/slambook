from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings
import os

# Use SQLite as fallback if PostgreSQL is not available
# For production, make sure to set DATABASE_URL in .env to PostgreSQL
database_url = os.getenv("DATABASE_URL", settings.DATABASE_URL)

# Set default to SQLite for easier development if PostgreSQL is not configured
if not database_url or database_url == "postgresql://user:password@localhost:5432/slambook_db":
    # Try PostgreSQL first, fall back to SQLite
    try:
        # Check if psycopg2 is available
        import psycopg2
        test_url = database_url if database_url and "postgresql" in database_url else "postgresql://user:password@localhost:5432/slambook_db"
        test_engine = create_engine(test_url, connect_args={"connect_timeout": 1})
        test_engine.connect()
        database_url = test_url
        print("[OK] Using PostgreSQL database")
    except ImportError:
        # psycopg2 not installed, use SQLite
        print("[INFO] PostgreSQL driver not available, using SQLite for development")
        database_url = "sqlite:///./slambook.db"
    except Exception:
        # PostgreSQL not available, fall back to SQLite
        print("[INFO] PostgreSQL not available, using SQLite for development")
        database_url = "sqlite:///./slambook.db"

# Set environment variable for models.py to detect SQLite
if database_url.startswith("sqlite"):
    os.environ["DATABASE_TYPE"] = "sqlite"
else:
    os.environ["DATABASE_TYPE"] = "postgresql"

engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

