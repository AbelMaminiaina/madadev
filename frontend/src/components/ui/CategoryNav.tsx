import { Link, useLocation } from 'react-router-dom';
import { categories } from '../../data/categories';

export const CategoryNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (categoryName: string) => {
    if (categoryName === 'HOME') {
      return currentPath === '/';
    }
    return currentPath === `/category/${categoryName.toLowerCase()}`;
  };

  return (
    <nav className="w-full overflow-x-auto scrollbar-hide">
      <ul className="flex items-center justify-center gap-0 min-w-max py-3">
        {categories.map((category, index) => (
          <li key={category.name} className="flex items-center">
            <Link
              to={category.name === 'HOME' ? '/' : `/category/${category.name.toLowerCase()}`}
              className={`
                px-4 py-1 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap
                ${
                  isActive(category.name)
                    ? 'text-accent font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-accent'
                }
              `}
            >
              {category.label}
            </Link>
            {index < categories.length - 1 && (
              <span className="text-gray-300 dark:text-gray-600">|</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
