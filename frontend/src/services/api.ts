import type { Article } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
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

  // Articles
  async getArticles(): Promise<Article[]> {
    return this.request<Article[]>('/articles');
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    return this.request<Article>(`/articles/${slug}`);
  }

  async createArticle(article: Omit<Article, 'slug'> & { slug?: string }): Promise<Article> {
    return this.request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(slug: string, updates: Partial<Article>): Promise<Article> {
    return this.request<Article>(`/articles/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteArticle(slug: string): Promise<void> {
    await this.request(`/articles/${slug}`, {
      method: 'DELETE',
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
