import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { categories } from '../data/categories';
import type { Article, Category, ArticleStatus } from '../types';

const StatusBadge = ({ status }: { status?: ArticleStatus }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const labels = {
    pending: 'En attente',
    published: 'Publie',
    rejected: 'Rejete',
  };

  const s = status || 'pending';
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[s]}`}>
      {labels[s]}
    </span>
  );
};

export const UserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'IA' as Category,
    image: '',
    content: '',
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const my = await api.getMyArticles();
      setMyArticles(my);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: editingSlug ? prev.slug : generateSlug(title),
    }));
  };

  const openCreateForm = () => {
    setEditingSlug(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      category: 'IA',
      image: '',
      content: '',
    });
    setIsFormOpen(true);
  };

  const openEditForm = (article: Article) => {
    setEditingSlug(article.slug);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      category: article.category,
      image: article.image || '',
      content: article.content,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('Titre et contenu sont requis');
      return;
    }

    try {
      if (editingSlug) {
        // Update existing article
        await api.updateArticle(editingSlug, {
          title: formData.title,
          category: formData.category,
          image: formData.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
          excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
          content: formData.content,
        });
      } else {
        // Create new article
        await api.createArticle({
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          category: formData.category,
          image: formData.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
          excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
          content: formData.content,
        });
      }

      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        category: 'IA',
        image: '',
        content: '',
      });
      setEditingSlug(null);
      setIsFormOpen(false);
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Erreur lors de la sauvegarde de l\'article');
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm('Supprimer cet article ?')) {
      try {
        await api.deleteArticle(slug);
        fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleStatus = async (slug: string, activate: boolean) => {
    try {
      if (activate) {
        // Users cannot publish directly, show message
        alert('Seul un administrateur peut publier un article.');
        return;
      } else {
        // Deactivate - set to pending
        await api.updateArticle(slug, { status: 'pending' });
      }
      fetchArticles();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes articles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bienvenue {user?.name}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Voir le site
          </button>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            + Nouvel article
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSlug ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {editingSlug
                  ? 'Les modifications seront soumises a validation.'
                  : 'Votre article sera soumis a validation avant publication.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              {/* Slug - only for new articles */}
              {!editingSlug && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="titre-de-larticle"
                  />
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  {categories.filter(c => c.name !== 'HOME' && c.name !== 'AUTEURS').map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image (URL)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resume
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Courte description de l'article..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contenu (Markdown) *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent font-mono text-sm"
                  placeholder="# Titre de section&#10;&#10;Votre contenu en Markdown..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingSlug(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                >
                  {editingSlug ? 'Enregistrer' : 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Chargement...
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {myArticles.map((article) => (
                <tr key={article.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {article.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {article.author}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {article.status === 'published' ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => handleToggleStatus(article.slug, false)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-green-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400">Actif</span>
                        </label>
                      ) : (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={article.status} />
                          {article.status === 'rejected' && (
                            <span className="text-xs text-gray-500">(non modifiable)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {article.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {article.status === 'published' && (
                        <button
                          onClick={() => navigate(`/article/${article.slug}`)}
                          className="text-accent hover:text-accent-dark text-sm"
                        >
                          Voir
                        </button>
                      )}
                      <button
                        onClick={() => openEditForm(article)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {myArticles.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Vous n'avez pas encore d'articles. Creez votre premier article !
            </div>
          )}
        </div>
      )}
    </div>
  );
};
