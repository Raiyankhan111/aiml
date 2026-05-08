import { useState } from 'react';
import { useNewsData } from '../hooks/useNewsData';
import { RefreshCw, Search, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES = ['technology', 'science', 'business', 'health', 'general'];

export default function NewsSection() {
  const { articles, loading, error, category, setCategory, refreshNews } = useNewsData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[850px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">Latest News</h2>
        <button 
          onClick={refreshNews}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Refresh News"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading && !articles.length ? (
          Array.from({ length: 4 }).map((_, i) => <NewsSkeleton key={i} />)
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
            No articles found.
          </div>
        ) : (
          filteredArticles.map((article, i) => (
            <a 
              key={i} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 transition-all hover:shadow-md border border-transparent hover:border-blue-200 dark:hover:border-blue-900"
            >
              <div className="flex gap-4">
                {article.urlToImage && (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title} 
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="truncate max-w-[120px]">{article.source.name}</span>
                    <span>•</span>
                    <span>{article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : ''}</span>
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex gap-4 animate-pulse">
      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mt-4"></div>
      </div>
    </div>
  );
}
