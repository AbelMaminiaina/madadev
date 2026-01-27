from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import get_db, engine
from models import Base, Article as ArticleModel
from schemas import Article, ArticleCreate, ArticleUpdate

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dev Stories API",
    description="API pour le blog Dev Stories",
    version="1.0.0"
)

# CORS
import os
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Dev Stories API", "version": "1.0.0"}


# Articles endpoints
@app.get("/api/articles", response_model=List[Article])
def get_articles(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ArticleModel)
    if category and category.upper() != "HOME":
        query = query.filter(ArticleModel.category == category.upper())
    return query.order_by(ArticleModel.date.desc()).all()


@app.get("/api/articles/search", response_model=List[Article])
def search_articles(
    q: str,
    db: Session = Depends(get_db)
):
    search = f"%{q}%"
    return db.query(ArticleModel).filter(
        (ArticleModel.title.ilike(search)) |
        (ArticleModel.excerpt.ilike(search)) |
        (ArticleModel.content.ilike(search))
    ).all()


@app.get("/api/articles/{slug}", response_model=Article)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(ArticleModel).filter(ArticleModel.slug == slug).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.post("/api/articles", response_model=Article)
def create_article(article: ArticleCreate, db: Session = Depends(get_db)):
    # Check if slug exists
    existing = db.query(ArticleModel).filter(ArticleModel.slug == article.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Article with this slug already exists")

    db_article = ArticleModel(
        title=article.title,
        slug=article.slug,
        author=article.author,
        date=article.date or date.today(),
        category=article.category,
        image=article.image,
        excerpt=article.excerpt,
        content=article.content
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


@app.put("/api/articles/{slug}", response_model=Article)
def update_article(slug: str, article: ArticleUpdate, db: Session = Depends(get_db)):
    db_article = db.query(ArticleModel).filter(ArticleModel.slug == slug).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    update_data = article.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_article, key, value)

    db.commit()
    db.refresh(db_article)
    return db_article


@app.delete("/api/articles/{slug}")
def delete_article(slug: str, db: Session = Depends(get_db)):
    db_article = db.query(ArticleModel).filter(ArticleModel.slug == slug).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted"}
