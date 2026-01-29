from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: int
    email: str
    name: str
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Article Schemas
class ArticleBase(BaseModel):
    title: str
    slug: str
    author: str = "ABEL R."
    category: str
    image: Optional[str] = None
    excerpt: Optional[str] = None
    content: str


class ArticleCreate(BaseModel):
    title: str
    slug: str
    category: str
    image: Optional[str] = None
    excerpt: Optional[str] = None
    content: str
    date: Optional[date] = None


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None  # pending, published, rejected


class ArticleStatusUpdate(BaseModel):
    status: str  # pending, published, rejected


class Article(ArticleBase):
    id: int
    date: date
    status: str = "pending"
    author_id: Optional[int] = None

    class Config:
        from_attributes = True
