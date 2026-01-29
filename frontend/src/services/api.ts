import type { Article, ArticleStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Articles - Public
  async getArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles');
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    return this.request<Article>(`/articles/${slug}`);
  }

  // Articles - Authenticated
  async getMyArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles/my', {
      headers: this.getAuthHeader(),
    });
  }

  async getPendingArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles/pending', {
      headers: this.getAuthHeader(),
    });
  }

  async getAllArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles/all', {
      headers: this.getAuthHeader(),
    });
  }

  async createArticle(article: Omit<Article, 'slug' | 'author' | 'status' | 'author_id' | 'date'> & { slug?: string }): Promise<Article> {
    return this.request<Article>('/articles', {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(article),
    });
  }

  async updateArticle(slug: string, updates: Partial<Article>): Promise<Article> {
    return this.request<Article>(`/articles/${slug}`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify(updates),
    });
  }

  async updateArticleStatus(slug: string, status: ArticleStatus): Promise<Article> {
    return this.request<Article>(`/articles/${slug}/status`, {
      method: 'PUT',
      headers: this.getAuthHeader(),
      body: JSON.stringify({ status }),
    });
  }

  async deleteArticle(slug: string): Promise<void> {
    await this.request(`/articles/${slug}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
  }

  // Categories
  async getArticlesByCategory(category: string): Promise<Article[]> {
    return this.request<Article[]>(`/articles?category=${category}`);
  }

  // Search
  async searchArticles(query: string): Promise<Article[]> {
    return this.request<Article[]>(`/articles/search?q=${encodeURIComponent(query)}`);
  }
}

export const api = new ApiService();
