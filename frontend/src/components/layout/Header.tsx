import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { SearchBar } from '../ui/SearchBar';
import { CategoryNav } from '../ui/CategoryNav';
import { useTheme } from '../../hooks/useTheme';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="relative flex items-center justify-between px-4 py-4">
          {/* Left - Dark Mode & Search */}
          <div className="flex items-center gap-4 z-10">
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
              <span className="hidden sm:inline uppercase text-xs font-medium tracking-wider">
                {isDark ? 'Clair' : 'Sombre'}
              </span>
            </button>
            <SearchBar />
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>

          {/* Right - Auth Buttons */}
          <div className="flex items-center gap-3 z-10">
            <Link
              to="#"
              className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              S'identifier
            </Link>
            <Link
              to="#"
              className="px-4 py-2 bg-accent text-white text-sm font-medium rounded hover:bg-accent-dark transition-colors"
            >
              S'abonner
            </Link>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-gray-100 dark:border-gray-800">
          <CategoryNav />
        </div>
      </div>
    </header>
  );
};
