import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function PostCard({ post, style }) {
  const navigate = useNavigate();
  const firstTag = post.tags?.[0];

  return (
    <div className="post-card animate-in" style={style} onClick={() => navigate(`/post/${post.id}`)}>
      <div className="post-card-banner" style={{ background: post.coverColor }} />
      <div className="post-card-body">
        <div className="post-card-meta">
          {firstTag && (
            <span className="post-tag" style={{
              color: post.coverColor,
              borderColor: post.coverColor + '40',
              background: post.coverColor + '18'
            }}>
              {firstTag}
            </span>
          )}
          <span className="post-card-date">{formatDate(post.createdAt)}</span>
        </div>
        <h2 className="post-card-title">{post.title}</h2>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-footer">
          <div className="post-card-author">
            <div className="author-avatar" style={{ background: post.coverColor }}>
              {initials(post.author)}
            </div>
            <span className="author-name">{post.author}</span>
          </div>
          <span className="post-read-time">
            <Clock size={12} /> {post.readTime} min read
          </span>
        </div>
      </div>
    </div>
  );
}
