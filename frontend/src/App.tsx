import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Admin route without Layout */}
          <Route path="/admin" element={
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
              <AdminPage />
            </div>
          } />

          {/* Public routes with Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:slug" element={<ArticlePage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
