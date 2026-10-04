import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';

export default function App() {
  return (
    <BlogProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/new" element={<PostEditor />} />
            <Route path="/edit/:id" element={<PostEditor />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </BlogProvider>
  );
}
