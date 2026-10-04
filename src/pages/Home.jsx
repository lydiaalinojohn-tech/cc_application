import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PenLine } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import PostCard from '../components/PostCard';

export default function Home() {
  const { posts } = useBlog();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = posts.filter(p => {
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">✨ Your Personal Blog</div>
        <h1 className="hero-title">Ideas Worth Sharing</h1>
        <p className="hero-subtitle">
          Write, edit, and explore your stories — all stored in memory, beautifully presented.
        </p>
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            placeholder="Search posts, authors, tags…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Posts */}
      <div className="section-header">
        <span className="section-title">All Posts</span>
        <span className="post-count">
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">
            {query ? 'No posts match your search' : 'No posts yet'}
          </h3>
          <p className="empty-desc">
            {query ? 'Try a different keyword.' : 'Be the first to write something amazing.'}
          </p>
          {!query && (
            <button className="btn btn-primary" onClick={() => navigate('/new')}>
              <PenLine size={14} /> Write your first post
            </button>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
