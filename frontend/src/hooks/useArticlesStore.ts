import { useSyncExternalStore, useCallback, useMemo } from 'react';
import type { Article, Category } from '../types';
import { api } from '../services/api';

const STORAGE_KEY = 'devstories_articles';
const USE_API = import.meta.env.VITE_USE_API === 'true';

// Default sample articles (fallback when no API)
const defaultArticles: Article[] = [
  {
    title: "Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA",
    slug: "au-dela-du-hype-ia",
    author: "ABEL R.",
    date: "2026-01-25",
    category: "IA",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
    excerpt: "Une analyse approfondie de l'impact réel de l'IA sur les entreprises et la société.",
    content: `# Au-delà du hype : pilotage, rentabilité et impact sociétal de l'IA

L'intelligence artificielle est partout. Mais au-delà des promesses marketing, quel est son impact réel ?

## Le coût caché de l'IA

- Infrastructure cloud
- Données d'entraînement
- Expertise technique
- Maintenance continue`
  },
  {
    title: "Grokipedia : une simple encyclopédie ?",
    slug: "grokipedia-encyclopedie",
    author: "ABEL R.",
    date: "2026-01-23",
    category: "IA",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    excerpt: "Découverte de Grokipedia, le nouveau projet qui veut révolutionner l'accès au savoir.",
    content: `# Grokipedia : une simple encyclopédie ?

Grokipedia promet de transformer notre façon d'accéder à l'information.`
  },
  {
    title: "Recruteur Tech : les 7 clés pour survivre",
    slug: "recruteur-tech-7-cles",
    author: "ABEL R.",
    date: "2026-01-15",
    category: "RH",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
    excerpt: "Le métier de recruteur tech évolue. Voici les compétences essentielles.",
    content: `# Recruteur Tech : les 7 clés pour survivre

Le recrutement tech est un métier à part.`
  },
  {
    title: "Le principe de Peter",
    slug: "principe-de-peter",
    author: "ABEL R.",
    date: "2026-01-13",
    category: "STORY",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
    excerpt: "Comprendre pourquoi certains managers semblent incompétents.",
    content: `# Le principe de Peter

"Dans une hiérarchie, tout employé tend à s'élever à son niveau d'incompétence."`
  },
  {
    title: "AbortController en JavaScript",
    slug: "abort-controller-javascript",
    author: "ABEL R.",
    date: "2026-01-05",
    category: "FRONT",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop",
    excerpt: "Maîtrisez l'AbortController pour gérer vos requêtes asynchrones.",
    content: `# AbortController en JavaScript

L'AbortController est un outil puissant pour gérer les requêtes HTTP.`
  },
  {
    title: "Kubernetes en 2026",
    slug: "kubernetes-2026",
    author: "ABEL R.",
    date: "2026-01-10",
    category: "CLOUD",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop",
    excerpt: "Les nouvelles pratiques Kubernetes à adopter.",
    content: `# Kubernetes en 2026

Kubernetes continue d'évoluer. GitOps partout avec ArgoCD et Flux.`
  }
];

// Store class
class ArticlesStore {
  private articles: Article[] = [];
  private listeners: Set<() => void> = new Set();
  private loading = false;

  constructor() {
    this.loadInitialData();
  }

  private async loadInitialData() {
    if (USE_API) {
      await this.fetchFromApi();
    } else {
      this.loadFromStorage();
    }
  }

  private async fetchFromApi() {
    try {
      this.loading = true;
      this.emitChange();
      this.articles = await api.getArticles();
      this.loading = false;
      this.emitChange();
    } catch (error) {
      console.error('Failed to fetch from API, falling back to localStorage:', error);
      this.loadFromStorage();
      this.loading = false;
      this.emitChange();
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') {
      this.articles = defaultArticles;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.articles = JSON.parse(stored);
      } catch {
        this.articles = defaultArticles;
        this.saveToStorage();
      }
    } else {
      this.articles = defaultArticles;
      this.saveToStorage();
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles));
    }
  }

  private emitChange() {
    this.listeners.forEach(listener => listener());
  }

  getSnapshot = (): Article[] => {
    return this.articles;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  async addArticle(article: Article) {
    if (USE_API) {
      try {
        const newArticle = await api.createArticle(article);
        this.articles = [newArticle, ...this.articles];
      } catch (error) {
        console.error('Failed to create article:', error);
        throw error;
      }
    } else {
      this.articles = [article, ...this.articles];
      this.saveToStorage();
    }
    this.emitChange();
  }

  async deleteArticle(slug: string) {
    if (USE_API) {
      try {
        await api.deleteArticle(slug);
        this.articles = this.articles.filter(a => a.slug !== slug);
      } catch (error) {
        console.error('Failed to delete article:', error);
        throw error;
      }
    } else {
      this.articles = this.articles.filter(a => a.slug !== slug);
      this.saveToStorage();
    }
    this.emitChange();
  }

  async updateArticle(slug: string, updates: Partial<Article>) {
    if (USE_API) {
      try {
        const updated = await api.updateArticle(slug, updates);
        this.articles = this.articles.map(a => a.slug === slug ? updated : a);
      } catch (error) {
        console.error('Failed to update article:', error);
        throw error;
      }
    } else {
      this.articles = this.articles.map(a =>
        a.slug === slug ? { ...a, ...updates } : a
      );
      this.saveToStorage();
    }
    this.emitChange();
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find(article => article.slug === slug);
  }

  async refresh() {
    if (USE_API) {
      await this.fetchFromApi();
    }
  }

  isLoading(): boolean {
    return this.loading;
  }
}

// Singleton
const store = new ArticlesStore();

export const useArticlesStore = (category?: Category) => {
  const articles = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );

  const addArticle = useCallback(async (article: Article) => {
    await store.addArticle(article);
  }, []);

  const deleteArticle = useCallback(async (slug: string) => {
    await store.deleteArticle(slug);
  }, []);

  const updateArticle = useCallback(async (slug: string, updates: Partial<Article>) => {
    await store.updateArticle(slug, updates);
  }, []);

  const getArticleBySlug = useCallback((slug: string): Article | undefined => {
    return store.getArticleBySlug(slug);
  }, []);

  const refresh = useCallback(async () => {
    await store.refresh();
  }, []);

  const filteredArticles = useMemo(() => {
    if (!category || category === 'HOME') {
      return articles;
    }
    return articles.filter(article => article.category === category);
  }, [articles, category]);

  return {
    articles: filteredArticles,
    allArticles: articles,
    loading: store.isLoading(),
    addArticle,
    deleteArticle,
    updateArticle,
    getArticleBySlug,
    refresh,
  };
};
