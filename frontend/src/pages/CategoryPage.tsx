import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useArticlesStore } from '../hooks/useArticlesStore';
import { ArticleGrid } from '../components/articles/ArticleGrid';
import { getCategoryInfo } from '../data/categories';
import type { Category } from '../types';

export const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const categoryUpper = category?.toUpperCase() as Category;
  const { articles, refresh } = useArticlesStore(categoryUpper);
  const categoryInfo = getCategoryInfo(categoryUpper);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {categoryInfo && (
            <span
              className={`category-badge text-base ${categoryInfo.bgColor} ${categoryInfo.color}`}
            >
              {categoryInfo.label}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {categoryInfo?.label || category}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {articles.length} article{articles.length !== 1 ? 's' : ''} dans cette
          catégorie
        </p>
      </section>

      {/* Articles Grid */}
      <section>
        <ArticleGrid articles={articles} />
      </section>
    </div>
  );
};
