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


@app.post("/api/seed")
def seed_database(db: Session = Depends(get_db)):
    """Seed the database with sample articles"""
    from datetime import date as d

    # Check if articles already exist
    existing = db.query(ArticleModel).count()
    if existing > 0:
        return {"message": f"Database already has {existing} articles", "seeded": False}

    articles = [
        {
            "title": "Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA",
            "slug": "au-dela-du-hype-ia",
            "author": "ABEL R.",
            "date": d(2026, 1, 25),
            "category": "IA",
            "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
            "excerpt": "Une analyse approfondie de l'impact réel de l'IA sur les entreprises et la société.",
            "content": "# Au-delà du hype\n\nL'intelligence artificielle est partout. Mais au-delà des promesses marketing, quel est son impact réel ?\n\n## Le coût caché de l'IA\n\n- Infrastructure cloud\n- Données d'entraînement\n- Expertise technique"
        },
        {
            "title": "Grokipedia : une simple encyclopédie ?",
            "slug": "grokipedia-encyclopedie",
            "author": "ABEL R.",
            "date": d(2026, 1, 23),
            "category": "IA",
            "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
            "excerpt": "Découverte de Grokipedia, le nouveau projet qui veut révolutionner l'accès au savoir.",
            "content": "# Grokipedia\n\nGrokipedia promet de transformer notre façon d'accéder à l'information."
        },
        {
            "title": "Recruteur Tech : les 7 clés pour survivre",
            "slug": "recruteur-tech-7-cles",
            "author": "ABEL R.",
            "date": d(2026, 1, 15),
            "category": "RH",
            "image": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
            "excerpt": "Le métier de recruteur tech évolue. Voici les compétences essentielles.",
            "content": "# Recruteur Tech\n\nLe recrutement tech est un métier à part."
        },
        {
            "title": "Le principe de Peter",
            "slug": "principe-de-peter",
            "author": "ABEL R.",
            "date": d(2026, 1, 13),
            "category": "STORY",
            "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
            "excerpt": "Comprendre pourquoi certains managers semblent incompétents.",
            "content": "# Le principe de Peter\n\nDans une hiérarchie, tout employé tend à s'élever à son niveau d'incompétence."
        },
        {
            "title": "AbortController en JavaScript",
            "slug": "abort-controller-javascript",
            "author": "ABEL R.",
            "date": d(2026, 1, 5),
            "category": "FRONT",
            "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
            "excerpt": "Maîtrisez l'AbortController pour gérer vos requêtes asynchrones.",
            "content": "# AbortController\n\nL'AbortController est un outil puissant pour gérer les requêtes HTTP."
        },
        {
            "title": "Kubernetes en 2026",
            "slug": "kubernetes-2026",
            "author": "ABEL R.",
            "date": d(2026, 1, 10),
            "category": "CLOUD",
            "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
            "excerpt": "Les nouvelles pratiques Kubernetes à adopter.",
            "content": "# Kubernetes en 2026\n\nKubernetes continue d'évoluer. GitOps partout avec ArgoCD et Flux."
        }
    ]

    for article_data in articles:
        db.add(ArticleModel(**article_data))

    db.commit()
    return {"message": f"Successfully seeded {len(articles)} articles", "seeded": True}
