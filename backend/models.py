from sqlalchemy import Column, Integer, String, Text, Date
from database import Base


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
