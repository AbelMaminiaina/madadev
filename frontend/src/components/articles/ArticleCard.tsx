import { Link } from 'react-router-dom';
import type { Article } from '../../types';
import { getCategoryInfo } from '../../data/categories';
import { formatDateShort } from '../../utils/date';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const categoryInfo = getCategoryInfo(article.category);

  return (
    <Link to={`/article/${article.slug}`} className="block group">
      <article className="article-card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Category Badge */}
          {categoryInfo && (
            <span
              className={`absolute top-3 left-3 category-badge ${categoryInfo.bgColor} ${categoryInfo.color}`}
            >
              {categoryInfo.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {article.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
            {article.excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
            <span className="font-medium">{article.author}</span>
            <time dateTime={article.date}>{formatDateShort(article.date)}</time>
          </div>
        </div>
      </article>
    </Link>
  );
};
