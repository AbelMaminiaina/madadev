import { useParams, Navigate } from 'react-router-dom';
import { useArticlesStore } from '../hooks/useArticlesStore';
import { ArticleDetail } from '../components/articles/ArticleDetail';

export const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug } = useArticlesStore();

  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="px-4 py-8">
      <ArticleDetail article={article} />
    </div>
  );
};
