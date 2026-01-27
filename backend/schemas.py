from pydantic import BaseModel
from typing import Optional
from datetime import date


class ArticleBase(BaseModel):
    title: str
    slug: str
    author: str = "ABEL R."
    category: str
    image: Optional[str] = None
    excerpt: Optional[str] = None
    content: str


class ArticleCreate(ArticleBase):
    date: Optional[date] = None


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None


class Article(ArticleBase):
    id: int
    date: date

    class Config:
        from_attributes = True
