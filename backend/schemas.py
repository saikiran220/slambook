from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


# Entry Schemas
class EntryBase(BaseModel):
    name: str
    nickname: str
    birthday: str
    contact_number: str
    likes: Optional[str] = None
    dislikes: Optional[str] = None
    favorite_movie: Optional[str] = None
    favorite_food: Optional[str] = None
    about: str
    message: str
    tags: Optional[List[str]] = None
    is_favorite: Optional[bool] = False


class EntryCreate(EntryBase):
    pass


class EntryUpdate(EntryBase):
    pass


class EntryResponse(EntryBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EntryStatistics(BaseModel):
    total: int
    favorites: int
    by_tag: dict[str, int]

