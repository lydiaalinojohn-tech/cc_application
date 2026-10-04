import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import { useToast } from '../components/Layout';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

function insertAround(textarea, before, after) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.slice(start, end) || 'text';
  const newText = text.slice(0, start) + before + selected + after + text.slice(end);
  return { value: newText, cursor: start + before.length + selected.length + after.length };
}

function insertAtLineStart(textarea, prefix) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  return { value: newText, cursor: start + prefix.length };
}

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, createPost, updatePost } = useBlog();
  const addToast = useToast();
  const textareaRef = useRef(null);

  const existing = id ? getPost(id) : null;

  const [form, setForm] = useState({
    title: existing?.title || '',
    excerpt: existing?.excerpt || '',
    author: existing?.author || '',
    tags: existing?.tags?.join(', ') || '',
    content: existing?.content || '',
    coverColor: existing?.coverColor || '#6366f1',
  });

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const applyFormat = action => {
    const ta = textareaRef.current;
    if (!ta) return;
    let result;
    switch (action) {
      case 'bold':   result = insertAround(ta, '**', '**'); break;
      case 'italic': result = insertAround(ta, '*', '*'); break;
      case 'code':   result = insertAround(ta, '`', '`'); break;
      case 'h1':     result = insertAtLineStart(ta, '# '); break;
      case 'h2':     result = insertAtLineStart(ta, '## '); break;
      case 'h3':     result = insertAtLineStart(ta, '### '); break;
      case 'ul':     result = insertAtLineStart(ta, '- '); break;
      case 'quote':  result = insertAtLineStart(ta, '> '); break;
      default: return;
    }
    setForm(prev => ({ ...prev, content: result.value }));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(result.cursor, result.cursor); }, 0);
  };

  const handleSave = () => {
    if (!form.title.trim()) { alert('Title is required'); return; }
    if (!form.content.trim()) { alert('Content is required'); return; }
    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (id) {
      updatePost(id, data);
      addToast('Post updated!');
      navigate(`/post/${id}`);
    } else {
      const newPost = createPost(data);
      addToast('Post published!');
      navigate(`/post/${newPost.id}`);
    }
  };

  const TOOLBAR = [
    { label: 'H1', action: 'h1' },
    { label: 'H2', action: 'h2' },
    { label: 'H3', action: 'h3' },
    { label: 'B', action: 'bold' },
    { label: 'I', action: 'italic' },
    { label: '</>', action: 'code' },
    { label: '• List', action: 'ul' },
    { label: '❝ Quote', action: 'quote' },
  ];

  return (
    <div className="container">
      <div className="editor-page animate-in">
        <input
          className="editor-title-input"
          placeholder="Your post title…"
          value={form.title}
          onChange={set('title')}
        />

        <div className="editor-field">
          <label className="editor-label">Excerpt</label>
          <input
            className="editor-input"
            placeholder="A short summary shown on the feed…"
            value={form.excerpt}
            onChange={set('excerpt')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="editor-grid">
          <div className="editor-field">
            <label className="editor-label">Author</label>
            <input
              className="editor-input"
              placeholder="Your name"
              value={form.author}
              onChange={set('author')}
            />
          </div>
          <div className="editor-field">
            <label className="editor-label">Tags (comma-separated)</label>
            <input
              className="editor-input"
              placeholder="react, tutorial, webdev"
              value={form.tags}
              onChange={set('tags')}
            />
          </div>
        </div>

        <div className="editor-field">
          <label className="editor-label">Cover Color</label>
          <div className="editor-color-picker">
            {COLORS.map(c => (
              <div
                key={c}
                className={`color-swatch ${form.coverColor === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setForm(prev => ({ ...prev, coverColor: c }))}
              />
            ))}
          </div>
        </div>

        <div className="editor-field">
          <label className="editor-label">Content (Markdown supported)</label>
          <div className="editor-toolbar">
            {TOOLBAR.map(({ label, action }) => (
              <button
                key={action}
                className="toolbar-btn"
                onMouseDown={e => { e.preventDefault(); applyFormat(action); }}
              >
                {label}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            className="editor-textarea editor-textarea-wrapped"
            placeholder="Write your post content here… Markdown is supported."
            value={form.content}
            onChange={set('content')}
          />
        </div>

        <div className="editor-actions">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            <X size={14} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={14} /> {id ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
