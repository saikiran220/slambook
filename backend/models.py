from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import TypeDecorator, JSON
import uuid
import os
from database import Base

# Check if using SQLite or PostgreSQL
database_type = os.getenv("DATABASE_TYPE", "")
is_sqlite = database_type == "sqlite" or os.getenv("DATABASE_URL", "").startswith("sqlite")


# For SQLite compatibility: Use String for UUIDs and JSON for arrays
if is_sqlite:
    UUIDType = String(36)
    ArrayType = JSON
else:
    UUIDType = UUID(as_uuid=True)
    ArrayType = ARRAY(String)


class User(Base):
    __tablename__ = "users"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    entries = relationship("Entry", back_populates="owner", cascade="all, delete-orphan")


class Entry(Base):
    __tablename__ = "entries"

    id = Column(UUIDType, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(UUIDType, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Entry fields
    name = Column(String(255), nullable=False)
    nickname = Column(String(255), nullable=False)
    birthday = Column(String(50), nullable=False)
    contact_number = Column(String(50), nullable=False)
    likes = Column(Text, nullable=True)
    dislikes = Column(Text, nullable=True)
    favorite_movie = Column(String(255), nullable=True)
    favorite_food = Column(String(255), nullable=True)
    about = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    tags = Column(ArrayType, nullable=True)
    is_favorite = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    owner = relationship("User", back_populates="entries")

