import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { SearchBar } from '../ui/SearchBar';
import { CategoryNav } from '../ui/CategoryNav';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/categories';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

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

          {/* Search & Theme on right */}
          <div className="flex items-center gap-1">
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
            <SearchBar />
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            {/* Auth Section */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {user?.name}
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
                  to="/admin"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {user?.name}
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
