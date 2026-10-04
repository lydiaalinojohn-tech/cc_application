import { useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import Toast from './Toast';
import { useState, createContext, useContext } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  return (
    <ToastContext.Provider value={addToast}>
      <div className="app-wrapper">
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="navbar-logo" onClick={() => navigate('/')}>
              <div className="navbar-logo-icon">✍️</div>
              <span className="navbar-logo-text">Inkwell</span>
            </div>
            <div className="navbar-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
                Home
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/new')}>
                <PenLine size={14} /> New Post
              </button>
            </div>
          </div>
        </nav>

        <main className="page">{children}</main>

        <footer className="footer">
          Built with ✨ React &bull; All data stored in memory
        </footer>

        <div className="toast-container">
          {toasts.map(t => <Toast key={t.id} {...t} />)}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
