import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { Article } from '../types';

interface UseSearchOptions {
  threshold?: number;
  keys?: string[];
}

export const useSearch = (articles: Article[], options: UseSearchOptions = {}) => {
  const [query, setQuery] = useState('');

  const {
    threshold = 0.3,
    keys = ['title', 'excerpt', 'content', 'author', 'category'],
  } = options;

  const fuse = useMemo(() => {
    return new Fuse(articles, {
      keys,
      threshold,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [articles, keys, threshold]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return articles;
    }

    const searchResults = fuse.search(query);
    return searchResults.map(result => result.item);
  }, [query, fuse, articles]);

  const clearSearch = () => {
    setQuery('');
  };

  return {
    query,
    setQuery,
    results,
    clearSearch,
    isSearching: query.trim().length > 0,
  };
};
