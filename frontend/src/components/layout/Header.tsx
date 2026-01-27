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
        {/* Mobile Layout */}
        <div className="flex flex-col md:hidden px-4 py-3 gap-3">
          {/* Logo centered on mobile */}
          <div className="flex justify-center">
            <Logo />
          </div>
          {/* Controls row on mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            <Link
              to="#"
              className="px-3 py-1.5 bg-accent text-white text-sm font-medium rounded hover:bg-accent-dark transition-colors"
            >
              S'abonner
            </Link>
          </div>
        </div>

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
            <Link
              to="#"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
