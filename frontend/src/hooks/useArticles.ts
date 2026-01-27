import { useState, useEffect, useMemo } from 'react';
import type { Article, Category } from '../types';

// Sample articles with modern AI/tech images
const sampleArticles: Article[] = [
  {
    title: "Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA",
    slug: "au-dela-du-hype-ia",
    author: "ABEL R.",
    date: "2026-01-25",
    category: "IA",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
    excerpt: "Une analyse approfondie de l'impact réel de l'IA sur les entreprises et la société.",
    content: `
# Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA

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
3. **Innovation** : Nouveaux produits et services

## L'impact sociétal

L'IA soulève des questions éthiques importantes sur l'emploi, la vie privée et les biais algorithmiques.
    `
  },
  {
    title: "Grokipedia : une simple encyclopédie ?",
    slug: "grokipedia-encyclopedie",
    author: "ABEL R.",
    date: "2026-01-23",
    category: "IA",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    excerpt: "Découverte de Grokipedia, le nouveau projet qui veut révolutionner l'accès au savoir.",
    content: `
# Grokipedia : une simple encyclopédie ?

Grokipedia promet de transformer notre façon d'accéder à l'information. Mais qu'en est-il vraiment ?

## Un concept novateur

Contrairement aux encyclopédies traditionnelles, Grokipedia utilise l'IA générative pour synthétiser l'information en temps réel.

## Les avantages

- Mise à jour instantanée
- Personnalisation du contenu
- Multilingue natif

## Les limites

La vérification des sources reste un défi majeur dans ce type de projet.
    `
  },
  {
    title: "Recruteur Tech : les 7 clés pour survivre dans un métier entre relations humaines et complexité technique",
    slug: "recruteur-tech-7-cles",
    author: "ABEL R.",
    date: "2026-01-15",
    category: "RH",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
    excerpt: "Le métier de recruteur tech évolue. Voici les compétences essentielles pour réussir.",
    content: `
# Recruteur Tech : les 7 clés pour survivre

Le recrutement tech est un métier à part. Entre comprendre les technologies et séduire les candidats, voici les secrets du succès.

## 1. Comprendre l'écosystème tech

Impossible de recruter un développeur React sans savoir ce qu'est React.

## 2. Construire un réseau solide

Les meilleurs candidats ne sont pas sur les job boards.

## 3. Maîtriser le sourcing

LinkedIn, GitHub, Stack Overflow... chaque plateforme a ses codes.
    `
  },
  {
    title: "Le principe de Peter (ou pourquoi votre chef semble parfois... dépassé)",
    slug: "principe-de-peter",
    author: "ABEL R.",
    date: "2026-01-13",
    category: "STORY",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    excerpt: "Comprendre pourquoi certains managers semblent incompétents et comment y remédier.",
    content: `
# Le principe de Peter

"Dans une hiérarchie, tout employé tend à s'élever à son niveau d'incompétence."

## L'origine du concept

Laurence J. Peter a formulé ce principe en 1969, et il reste d'actualité.

## Applications dans la tech

Le meilleur développeur ne fait pas forcément le meilleur tech lead.

## Solutions

- Parcours de carrière alternatifs
- Formation au management
- Évaluation continue
    `
  },
  {
    title: "À mon signal, arrêtez tout ! Ou comment utiliser les AbortController",
    slug: "abort-controller-javascript",
    author: "ABEL R.",
    date: "2026-01-05",
    category: "FRONT",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    excerpt: "Maîtrisez l'AbortController pour gérer proprement vos requêtes asynchrones.",
    content: `
# À mon signal, arrêtez tout !

L'AbortController est un outil puissant pour gérer les requêtes HTTP et autres opérations asynchrones.

## Le problème

Sans annulation, les requêtes peuvent :
- Consommer de la bande passante inutilement
- Causer des race conditions
- Provoquer des memory leaks

## La solution

\`\`\`javascript
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(response => response.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Requête annulée');
    }
  });

// Plus tard...
controller.abort();
\`\`\`
    `
  },
  {
    title: "Kubernetes en 2026 : les nouvelles pratiques",
    slug: "kubernetes-2026",
    author: "ABEL R.",
    date: "2026-01-10",
    category: "CLOUD",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
    excerpt: "Tour d'horizon des évolutions de Kubernetes et des bonnes pratiques actuelles.",
    content: `
# Kubernetes en 2026

Kubernetes continue d'évoluer. Voici les pratiques à adopter cette année.

## GitOps partout

ArgoCD et Flux sont devenus incontournables pour le déploiement continu.

## Sécurité renforcée

- Network Policies par défaut
- Pod Security Standards
- Supply chain security

## Observabilité native

OpenTelemetry s'impose comme le standard d'observabilité.
    `
  },
  {
    title: "Sécuriser vos APIs : guide complet 2026",
    slug: "securiser-apis-2026",
    author: "ABEL R.",
    date: "2026-01-08",
    category: "SECURITE",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop",
    excerpt: "Les meilleures pratiques pour protéger vos APIs contre les attaques modernes.",
    content: `
# Sécuriser vos APIs en 2026

La sécurité des APIs est plus critique que jamais. Voici le guide complet.

## Authentification moderne

OAuth 2.1 et OIDC sont les standards à adopter.

## Protection contre les attaques

- Rate limiting intelligent
- WAF configuré pour les APIs
- Validation stricte des entrées
    `
  },
  {
    title: "Data Mesh : retour d'expérience après 2 ans",
    slug: "data-mesh-retour-experience",
    author: "ABEL R.",
    date: "2026-01-03",
    category: "DATA",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    excerpt: "Après 2 ans de Data Mesh en production, voici nos apprentissages.",
    content: `
# Data Mesh : retour d'expérience

Nous avons adopté le Data Mesh il y a 2 ans. Voici ce que nous avons appris.

## Les promesses tenues

- Autonomie des équipes
- Scalabilité organisationnelle
- Qualité des données améliorée

## Les défis rencontrés

- Gouvernance complexe
- Compétences à développer
- Outillage encore immature
    `
  }
];

export const useArticles = (category?: Category) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        setArticles(sampleArticles);
        setError(null);
      } catch (_err) {
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!category || category === 'HOME') {
      return articles;
    }
    return articles.filter(article => article.category === category);
  }, [articles, category]);

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find(article => article.slug === slug);
  };

  return {
    articles: filteredArticles,
    allArticles: articles,
    loading,
    error,
    getArticleBySlug,
  };
};
