import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Article } from '../../types';
import { useSearch } from '../../hooks/useSearch';
import { useArticlesStore } from '../../hooks/useArticlesStore';

export const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { allArticles } = useArticlesStore();
  const { query, setQuery, results, clearSearch, isSearching } = useSearch(allArticles);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        clearSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSearch]);

  const handleArticleClick = (article: Article) => {
    navigate(`/article/${article.slug}`);
    setIsOpen(false);
    clearSearch();
  };

  return (
    <div ref={containerRef} className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Rechercher"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      ) : (
        <div className="flex items-center">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-48 sm:w-64 md:w-80 px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              clearSearch();
            }}
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <ul>
              {results.slice(0, 5).map((article) => (
                <li key={article.slug}>
                  <button
                    onClick={() => handleArticleClick(article)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {article.excerpt}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};
