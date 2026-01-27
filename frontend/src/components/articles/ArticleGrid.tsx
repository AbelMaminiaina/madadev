import type { Article } from '../../types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
}

export const ArticleGrid = ({ articles }: ArticleGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Aucun article trouvé
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Il n'y a pas encore d'articles dans cette catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
};
