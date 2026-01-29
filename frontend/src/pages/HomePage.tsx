import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArticlesStore } from '../hooks/useArticlesStore';
import { getCategoryInfo } from '../data/categories';
import { formatDateShort } from '../utils/date';

export const HomePage = () => {
  const { articles, refresh } = useArticlesStore();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const featuredArticle = articles[0];
  const popularArticles = articles.slice(1, 5);
  const recentArticles = articles.slice(5, 11);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Hero Section - Asymmetric Grid 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 mb-10 lg:mb-12">
        {/* Featured Article - 70% */}
        <div className="lg:col-span-7">
          {featuredArticle && (
            <Link to={`/article/${featuredArticle.slug}`} className="block group">
              <article>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div>
                  {(() => {
                    const catInfo = getCategoryInfo(featuredArticle.category);
                    return catInfo ? (
                      <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${catInfo.bgColor} ${catInfo.color} mb-3`}>
                        {catInfo.label}
                      </span>
                    ) : null;
                  })()}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors leading-tight mb-3">
                    {featuredArticle.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {featuredArticle.author}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDateShort(featuredArticle.date)}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          )}
        </div>

        {/* Popular Articles Sidebar - 30% */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-accent">
            Articles populaires
          </h2>

          {/* Mobile Layout for Popular Articles */}
          <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
            {popularArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/article/${article.slug}`}
                className="flex gap-4 py-4 first:pt-0 group"
              >
                <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent group-hover:underline transition-colors leading-snug mb-auto">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {article.author}
                    </span>
                    <span className="text-xs text-accent">
                      {formatDateShort(article.date)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop Layout for Popular Articles */}
          <div className="hidden lg:block space-y-4">
            {popularArticles.map((article) => (
              <Link
                key={article.slug}
                to={`/article/${article.slug}`}
                className="flex gap-3 group"
              >
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent transition-colors leading-snug mb-auto">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {article.author}
                    </span>
                    <span className="text-xs text-accent">
                      {formatDateShort(article.date)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Articles Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
          Articles récents
        </h2>

        {/* Mobile Layout for Recent Articles */}
        <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {recentArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/article/${article.slug}`}
              className="flex gap-4 py-4 first:pt-0 group"
            >
              <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent group-hover:underline transition-colors leading-snug mb-auto">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {article.author}
                  </span>
                  <span className="text-xs text-accent">
                    {formatDateShort(article.date)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop Layout for Recent Articles */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 lg:gap-6">
          {recentArticles.map((article) => {
            const catInfo = getCategoryInfo(article.category);
            return (
              <Link
                key={article.slug}
                to={`/article/${article.slug}`}
                className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {catInfo && (
                    <span className={`text-xs font-semibold uppercase tracking-wider ${catInfo.color} mb-1`}>
                      {catInfo.label}
                    </span>
                  )}
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-accent transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{article.author}</span>
                    <span className="text-accent">{formatDateShort(article.date)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Newsletter CTA Banner */}
      <section className="mt-10 lg:mt-12">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Restez informé des dernières tendances tech
              </h3>
              <p className="text-emerald-100">
                Abonnez-vous à notre newsletter pour recevoir nos meilleurs articles.
              </p>
            </div>
            <Link
              to="/subscribe"
              className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              S'abonner gratuitement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
