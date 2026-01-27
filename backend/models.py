from sqlalchemy import Column, Integer, String, Text, Date, Boolean
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(500), unique=True, index=True, nullable=False)
    author = Column(String(200), nullable=False, default="ABEL R.")
    date = Column(Date, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    image = Column(String(1000), nullable=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
