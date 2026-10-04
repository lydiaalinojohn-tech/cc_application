import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Clock, Calendar, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../components/Layout';
import DeleteModal from '../components/DeleteModal';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineFormat(str) {
  return esc(str)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { html += '</ul>'; inUl = false; }
    if (inOl) { html += '</ol>'; inOl = false; }
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      closeList(); html += `<h3>${inlineFormat(line.slice(4))}</h3>`;
    } else if (line.startsWith('## ')) {
      closeList(); html += `<h2>${inlineFormat(line.slice(3))}</h2>`;
    } else if (line.startsWith('# ')) {
      closeList(); html += `<h1>${inlineFormat(line.slice(2))}</h1>`;
    } else if (line.startsWith('> ')) {
      closeList(); html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (!inOl) { html += '<ol>'; inOl = true; }
      html += `<li>${inlineFormat(line.replace(/^\d+\.\s/, ''))}</li>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (!inUl) { html += '<ul>'; inUl = true; }
      html += `<li>${inlineFormat(line.slice(2))}</li>`;
    } else if (line.trim() === '') {
      closeList();
    } else {
      closeList(); html += `<p>${inlineFormat(line)}</p>`;
    }
  }
  closeList();
  return html;
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, deletePost } = useBlog();
  const addToast = useToast();
  const [showDelete, setShowDelete] = useState(false);

  const post = getPost(id);

  if (!post) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h3 className="empty-title">Post not found</h3>
          <p className="empty-desc">This post may have been deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go home</button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deletePost(id);
    addToast('Post deleted successfully');
    navigate('/');
  };

  return (
    <div className="container">
      {showDelete && (
        <DeleteModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      )}

      <div className="post-detail-header animate-in">
        <div className="post-detail-tags">
          {(post.tags || []).map(tag => (
            <span key={tag} className="post-tag" style={{
              color: post.coverColor,
              borderColor: post.coverColor + '40',
              background: post.coverColor + '18'
            }}>
              {tag}
            </span>
          ))}
        </div>
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-detail-meta">
          <div className="post-detail-author">
            <div className="post-detail-author-avatar" style={{ background: post.coverColor }}>
              {initials(post.author)}
            </div>
            <span className="post-detail-author-name">{post.author}</span>
          </div>
          <span className="post-divider">·</span>
          <span className="post-detail-info"><Calendar size={13} /> {formatDate(post.createdAt)}</span>
          <span className="post-divider">·</span>
          <span className="post-detail-info"><Clock size={13} /> {post.readTime} min read</span>
        </div>
      </div>

      <div className="post-detail-banner" style={{ '--banner-color': post.coverColor }} />

      <div className="post-detail-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
          <ArrowLeft size={13} /> Back
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/edit/${id}`)}>
          <Pencil size={13} /> Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>
          <Trash2 size={13} /> Delete
        </button>
      </div>

      <article
        className="post-content animate-in"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />
    </div>
  );
}
