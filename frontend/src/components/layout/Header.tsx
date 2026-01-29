import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { SearchBar } from '../ui/SearchBar';
import { CategoryNav } from '../ui/CategoryNav';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../hooks/useSearch';
import { useArticlesStore } from '../../hooks/useArticlesStore';
import { categories } from '../../data/categories';
import type { Article } from '../../types';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile search
  const { allArticles } = useArticlesStore();
  const { query, setQuery, results, clearSearch, isSearching } = useSearch(allArticles);

  const closeMenu = () => {
    setIsMenuOpen(false);
    clearSearch();
  };

  const handleMobileArticleClick = (article: Article) => {
    navigate(`/article/${article.slug}`);
    closeMenu();
  };

  const isActive = (categoryName: string) => {
    if (categoryName === 'HOME') {
      return location.pathname === '/';
    }
    return location.pathname === `/category/${categoryName.toLowerCase()}`;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">
          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo centered */}
          <Logo />

          {/* Theme toggle on right */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            {/* Mobile Search */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent text-base"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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

              {/* Mobile Search Results */}
              {isSearching && (
                <div className="mt-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                  {results.length > 0 ? (
                    <ul>
                      {results.slice(0, 5).map((article) => (
                        <li key={article.slug}>
                          <button
                            onClick={() => handleMobileArticleClick(article)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                              {article.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                                {article.category}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {article.author}
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Aucun résultat trouvé
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth Section */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    to={user?.is_admin ? '/admin' : '/user'}
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {user?.is_admin ? 'Administration' : 'Mes articles'}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    S'identifier
                  </Link>
                  <Link
                    to="/subscribe"
                    onClick={closeMenu}
                    className="flex-1 py-2 text-center bg-accent text-white text-sm font-medium rounded hover:bg-accent-dark transition-colors"
                  >
                    S'abonner
                  </Link>
                </div>
              )}
            </div>

            {/* Categories */}
            <nav className="px-4 py-4">
              <ul className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link
                      to={category.name === 'HOME' ? '/' : `/category/${category.name.toLowerCase()}`}
                      onClick={closeMenu}
                      className={`
                        block px-3 py-2 text-sm font-medium rounded transition-colors
                        ${
                          isActive(category.name)
                            ? 'bg-accent text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between px-4 py-4">
          {/* Left - Dark Mode & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span className="uppercase text-xs font-medium tracking-wider">
                {isDark ? 'Clair' : 'Sombre'}
              </span>
            </button>
            <SearchBar />
          </div>

          {/* Center - Logo */}
          <Logo />

          {/* Right - Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.is_admin ? '/admin' : '/user'}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {user?.is_admin ? 'Administration' : 'Mes articles'}
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  S'identifier
                </Link>
                <Link
                  to="/subscribe"
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-accent-dark transition-colors"
                >
                  S'abonner
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Category Navigation - Desktop only */}
        <div className="hidden md:block border-t border-gray-100 dark:border-gray-800">
          <CategoryNav />
        </div>
      </div>
    </header>
  );
};
