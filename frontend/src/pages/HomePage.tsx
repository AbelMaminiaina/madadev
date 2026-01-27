import { Link } from 'react-router-dom';
import { useArticlesStore } from '../hooks/useArticlesStore';
import { getCategoryInfo } from '../data/categories';
import { formatDateShort } from '../utils/date';

export const HomePage = () => {
  const { articles } = useArticlesStore();

  const featuredArticle = articles[0];
  const sideArticle = articles[1];
  const latestArticles = articles.slice(2, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Small Article */}
        <div className="lg:col-span-3">
          {sideArticle && (
            <Link to={`/article/${sideArticle.slug}`} className="block group">
              <article>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                  <img
                    src={sideArticle.image}
                    alt={sideArticle.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {(() => {
                  const catInfo = getCategoryInfo(sideArticle.category);
                  return catInfo ? (
                    <span className={`text-xs font-semibold uppercase tracking-wider ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                  ) : null;
                })()}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-accent transition-colors leading-tight">
                  {sideArticle.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {sideArticle.author}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {formatDateShort(sideArticle.date)}
                </p>
              </article>
            </Link>
          )}
        </div>

        {/* Center Column - Featured Article */}
        <div className="lg:col-span-6">
          {featuredArticle && (
            <Link to={`/article/${featuredArticle.slug}`} className="block group">
              <article>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  {(() => {
                    const catInfo = getCategoryInfo(featuredArticle.category);
                    return catInfo ? (
                      <span className={`text-xs font-semibold uppercase tracking-wider ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    ) : null;
                  })()}
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-3 group-hover:text-accent transition-colors leading-tight">
                    {featuredArticle.title}
                  </h1>
                </div>
              </article>
            </Link>
          )}
        </div>

        {/* Right Column - Latest Articles */}
        <div className="lg:col-span-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Dernier
          </h3>
          <div className="space-y-4">
            {latestArticles.map((article) => {
              const catInfo = getCategoryInfo(article.category);
              return (
                <Link
                  key={article.slug}
                  to={`/article/${article.slug}`}
                  className="flex gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    {catInfo && (
                      <span className={`text-xs font-semibold uppercase tracking-wider ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mt-1 mb-1 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      {article.author}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDateShort(article.date)}
                    </p>
                  </div>
                  <div className="w-20 h-16 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
