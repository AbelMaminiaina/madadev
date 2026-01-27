"""
Script to seed the database with initial articles.
Run with: python seed.py
"""
from datetime import date
from database import SessionLocal, engine
from models import Base, Article

# Create tables
Base.metadata.create_all(bind=engine)

# Sample articles
articles = [
    {
        "title": "Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA",
        "slug": "au-dela-du-hype-ia",
        "author": "ABEL R.",
        "date": date(2026, 1, 25),
        "category": "IA",
        "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
        "excerpt": "Une analyse approfondie de l'impact réel de l'IA sur les entreprises et la société.",
        "content": """# Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA

L'intelligence artificielle est partout. Mais au-delà des promesses marketing, quel est son impact réel ?

## Le coût caché de l'IA

Déployer une solution d'IA en entreprise représente un investissement significatif :

- Infrastructure cloud
- Données d'entraînement
- Expertise technique
- Maintenance continue

## Mesurer le ROI

Comment évaluer concrètement le retour sur investissement ?

1. **Gains de productivité** : Automatisation des tâches répétitives
2. **Qualité** : Réduction des erreurs humaines
3. **Innovation** : Nouveaux produits et services"""
    },
    {
        "title": "Grokipedia : une simple encyclopédie ?",
        "slug": "grokipedia-encyclopedie",
        "author": "ABEL R.",
        "date": date(2026, 1, 23),
        "category": "IA",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
        "excerpt": "Découverte de Grokipedia, le nouveau projet qui veut révolutionner l'accès au savoir.",
        "content": """# Grokipedia : une simple encyclopédie ?

Grokipedia promet de transformer notre façon d'accéder à l'information.

## Un concept novateur

Contrairement aux encyclopédies traditionnelles, Grokipedia utilise l'IA générative pour synthétiser l'information en temps réel."""
    },
    {
        "title": "Recruteur Tech : les 7 clés pour survivre",
        "slug": "recruteur-tech-7-cles",
        "author": "ABEL R.",
        "date": date(2026, 1, 15),
        "category": "RH",
        "image": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
        "excerpt": "Le métier de recruteur tech évolue. Voici les compétences essentielles pour réussir.",
        "content": """# Recruteur Tech : les 7 clés pour survivre

Le recrutement tech est un métier à part.

## 1. Comprendre l'écosystème tech

Impossible de recruter un développeur React sans savoir ce qu'est React."""
    },
    {
        "title": "Le principe de Peter",
        "slug": "principe-de-peter",
        "author": "ABEL R.",
        "date": date(2026, 1, 13),
        "category": "STORY",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
        "excerpt": "Comprendre pourquoi certains managers semblent incompétents.",
        "content": """# Le principe de Peter

"Dans une hiérarchie, tout employé tend à s'élever à son niveau d'incompétence."

## L'origine du concept

Laurence J. Peter a formulé ce principe en 1969."""
    },
    {
        "title": "AbortController en JavaScript",
        "slug": "abort-controller-javascript",
        "author": "ABEL R.",
        "date": date(2026, 1, 5),
        "category": "FRONT",
        "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
        "excerpt": "Maîtrisez l'AbortController pour gérer vos requêtes asynchrones.",
        "content": """# AbortController en JavaScript

L'AbortController est un outil puissant pour gérer les requêtes HTTP."""
    },
    {
        "title": "Kubernetes en 2026",
        "slug": "kubernetes-2026",
        "author": "ABEL R.",
        "date": date(2026, 1, 10),
        "category": "CLOUD",
        "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
        "excerpt": "Les nouvelles pratiques Kubernetes à adopter.",
        "content": """# Kubernetes en 2026

Kubernetes continue d'évoluer. GitOps partout avec ArgoCD et Flux."""
    }
]


def seed():
    db = SessionLocal()
    try:
        # Check if articles already exist
        existing = db.query(Article).count()
        if existing > 0:
            print(f"Database already has {existing} articles. Skipping seed.")
            return

        # Add articles
        for article_data in articles:
            article = Article(**article_data)
            db.add(article)

        db.commit()
        print(f"Successfully seeded {len(articles)} articles!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
