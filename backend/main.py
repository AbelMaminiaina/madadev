from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, timedelta

from database import get_db, engine
from models import Base, Article as ArticleModel, User as UserModel
from schemas import (
    Article, ArticleCreate, ArticleUpdate, ArticleStatusUpdate,
    UserCreate, UserLogin, User, Token
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_active_user, get_current_user, get_user_by_email,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dev Stories API",
    description="API pour le blog Dev Stories",
    version="1.1.0"
)

# CORS
import os
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://madadev.vercel.app",
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Dev Stories API", "version": "1.0.0"}


# Auth endpoints
@app.post("/api/auth/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    db_user = UserModel(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        name=user.name,
        is_admin=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/auth/me", response_model=User)
def get_me(current_user: UserModel = Depends(get_current_active_user)):
    return current_user


# Articles endpoints
@app.get("/api/articles", response_model=List[Article])
def get_articles(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all published articles (public endpoint)"""
    query = db.query(ArticleModel).filter(ArticleModel.status == "published")
    if category and category.upper() != "HOME":
        query = query.filter(ArticleModel.category == category.upper())
    return query.order_by(ArticleModel.date.desc()).all()


@app.get("/api/articles/pending", response_model=List[Article])
def get_pending_articles(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get all pending articles (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(ArticleModel).filter(
        ArticleModel.status == "pending"
    ).order_by(ArticleModel.date.desc()).all()


@app.get("/api/articles/my", response_model=List[Article])
def get_my_articles(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get articles created by the current user"""
    return db.query(ArticleModel).filter(
        ArticleModel.author_id == current_user.id
    ).order_by(ArticleModel.date.desc()).all()


@app.get("/api/articles/all", response_model=List[Article])
def get_all_articles(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get all articles regardless of status (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(ArticleModel).order_by(ArticleModel.date.desc()).all()


@app.get("/api/articles/search", response_model=List[Article])
def search_articles(
    q: str,
    db: Session = Depends(get_db)
):
    """Search published articles"""
    search = f"%{q}%"
    return db.query(ArticleModel).filter(
        ArticleModel.status == "published",
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
def create_article(
    article: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Create a new article with status=pending"""
    # Check if slug exists
    existing = db.query(ArticleModel).filter(ArticleModel.slug == article.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Article with this slug already exists")

    db_article = ArticleModel(
        title=article.title,
        slug=article.slug,
        author=current_user.name,
        date=article.date or date.today(),
        category=article.category,
        image=article.image,
        excerpt=article.excerpt,
        content=article.content,
        status="pending",
        author_id=current_user.id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


@app.put("/api/articles/{slug}/status", response_model=Article)
def update_article_status(
    slug: str,
    status_update: ArticleStatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Update article status (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    if status_update.status not in ["pending", "published", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    db_article = db.query(ArticleModel).filter(ArticleModel.slug == slug).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    db_article.status = status_update.status
    db.commit()
    db.refresh(db_article)
    return db_article


@app.put("/api/articles/{slug}", response_model=Article)
def update_article(
    slug: str,
    article: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Update an article (owner or admin only)"""
    db_article = db.query(ArticleModel).filter(ArticleModel.slug == slug).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Check if user is owner or admin
    if db_article.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="You can only edit your own articles")

    update_data = article.model_dump(exclude_unset=True)

    # Non-admin users cannot change status to published directly
    if not current_user.is_admin and 'status' in update_data:
        if update_data['status'] == 'published':
            raise HTTPException(status_code=403, detail="Only admins can publish articles")

    for key, value in update_data.items():
        setattr(db_article, key, value)

    db.commit()
    db.refresh(db_article)
    return db_article


@app.delete("/api/articles/{slug}")
def delete_article(
    slug: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    """Delete an article (owner or admin only)"""
    db_article = db.query(ArticleModel).filter(ArticleModel.slug == slug).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Check if user is owner or admin
    if db_article.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="You can only delete your own articles")

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
            "content": "# Au-delà du hype\n\nL'intelligence artificielle est partout. Mais au-delà des promesses marketing, quel est son impact réel ?\n\n## Le coût caché de l'IA\n\n- Infrastructure cloud\n- Données d'entraînement\n- Expertise technique",
            "status": "published"
        },
        {
            "title": "Grokipedia : une simple encyclopédie ?",
            "slug": "grokipedia-encyclopedie",
            "author": "ABEL R.",
            "date": d(2026, 1, 23),
            "category": "IA",
            "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
            "excerpt": "Découverte de Grokipedia, le nouveau projet qui veut révolutionner l'accès au savoir.",
            "content": "# Grokipedia\n\nGrokipedia promet de transformer notre façon d'accéder à l'information.",
            "status": "published"
        },
        {
            "title": "Recruteur Tech : les 7 clés pour survivre",
            "slug": "recruteur-tech-7-cles",
            "author": "ABEL R.",
            "date": d(2026, 1, 15),
            "category": "RH",
            "image": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
            "excerpt": "Le métier de recruteur tech évolue. Voici les compétences essentielles.",
            "content": "# Recruteur Tech\n\nLe recrutement tech est un métier à part.",
            "status": "published"
        },
        {
            "title": "Le principe de Peter",
            "slug": "principe-de-peter",
            "author": "ABEL R.",
            "date": d(2026, 1, 13),
            "category": "STORY",
            "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
            "excerpt": "Comprendre pourquoi certains managers semblent incompétents.",
            "content": "# Le principe de Peter\n\nDans une hiérarchie, tout employé tend à s'élever à son niveau d'incompétence.",
            "status": "published"
        },
        {
            "title": "AbortController en JavaScript",
            "slug": "abort-controller-javascript",
            "author": "ABEL R.",
            "date": d(2026, 1, 5),
            "category": "FRONT",
            "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
            "excerpt": "Maîtrisez l'AbortController pour gérer vos requêtes asynchrones.",
            "content": "# AbortController\n\nL'AbortController est un outil puissant pour gérer les requêtes HTTP.",
            "status": "published"
        },
        {
            "title": "Kubernetes en 2026",
            "slug": "kubernetes-2026",
            "author": "ABEL R.",
            "date": d(2026, 1, 10),
            "category": "CLOUD",
            "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
            "excerpt": "Les nouvelles pratiques Kubernetes à adopter.",
            "content": "# Kubernetes en 2026\n\nKubernetes continue d'évoluer. GitOps partout avec ArgoCD et Flux.",
            "status": "published"
        }
    ]

    for article_data in articles:
        db.add(ArticleModel(**article_data))

    db.commit()
    return {"message": f"Successfully seeded {len(articles)} articles", "seeded": True}
