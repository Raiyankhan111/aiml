import { useState, useEffect, useCallback } from 'react';
import { fetchNewsData } from '../services/api';

const CACHE_KEY = 'news_cache';
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('technology');

  const loadNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = localStorage.getItem(`${CACHE_KEY}_${category}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = new Date().getTime();
          if (now - parsed.timestamp < CACHE_EXPIRY_MS) {
            setArticles(parsed.data);
            setLoading(false);
            return;
          }
        }
      }

      const data = await fetchNewsData(category);
      // Filter out removed or broken articles
      const validArticles = data.filter(a => a.title && a.title !== '[Removed]');
      
      // Save to cache
      localStorage.setItem(`${CACHE_KEY}_${category}`, JSON.stringify({
        timestamp: new Date().getTime(),
        data: validArticles
      }));

      setArticles(validArticles);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load news");
      // Fallback to cache if available even if expired
      const cached = localStorage.getItem(`${CACHE_KEY}_${category}`);
      if (cached) {
        setArticles(JSON.parse(cached).data);
      }
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    articles,
    loading,
    error,
    category,
    setCategory,
    refreshNews: () => loadNews(true)
  };
}
