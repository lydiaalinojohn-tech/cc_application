import { createContext, useContext, useState, useCallback } from 'react';

const SAMPLE_POSTS = [
  {
    id: '1',
    title: 'Welcome to Inkwell — Your Modern Blog',
    excerpt: 'Inkwell is a sleek, in-memory blog application built with React. Dive in to create, edit, and explore beautiful blog posts.',
    content: `# Welcome to Inkwell\n\nInkwell is your personal space to write, share, and explore ideas. This blog application runs entirely in your browser — no backend, no servers, just pure React magic.\n\n## What You Can Do\n\n- **Create** new blog posts with a rich editor\n- **Edit** any post at any time\n- **Delete** posts you no longer need\n- **Browse** all your posts from the home page\n\n## Getting Started\n\nClick the **"New Post"** button in the navigation bar to write your first post. Give it a title, an excerpt (a short summary shown on the feed), and the full content of your post.\n\nEnjoy writing!`,
    author: 'Inkwell Team',
    tags: ['welcome', 'intro', 'react'],
    createdAt: new Date('2026-01-15').toISOString(),
    updatedAt: new Date('2026-01-15').toISOString(),
    readTime: 2,
    coverColor: '#6366f1',
  },
  {
    id: '2',
    title: 'The Art of Mindful Mornings',
    excerpt: 'How a simple 20-minute morning ritual transformed my productivity, focus, and overall sense of well-being.',
    content: `# The Art of Mindful Mornings\n\nThere's something magical about the first hour of the day. Before the notifications flood in, before the meetings begin — there's a quiet window of possibility.\n\n## The 20-Minute Ritual\n\nI started waking up 20 minutes earlier. Not to scroll through social media, not to answer emails, but to simply **be present**.\n\n### Step 1: No Phone for 30 Minutes\n\nThe temptation is real, but keeping the phone face-down for the first 30 minutes sets a completely different tone for the day.\n\n### Step 2: Intentional Breathing\n\nFive deep breaths. In for four counts, hold for four, out for six. It sounds simple because it is — and it works.\n\n### Step 3: One Sentence of Gratitude\n\nJust one. "I'm grateful for the quiet this morning." That's enough to shift your perspective.\n\n## The Result\n\nAfter 30 days, I noticed I was less reactive, more focused, and somehow more creative. The mornings belong to you — protect them fiercely.`,
    author: 'Alex Rivera',
    tags: ['mindfulness', 'productivity', 'lifestyle'],
    createdAt: new Date('2026-02-08').toISOString(),
    updatedAt: new Date('2026-02-08').toISOString(),
    readTime: 4,
    coverColor: '#8b5cf6',
  },
  {
    id: '3',
    title: 'Why I Switched from VS Code to Neovim',
    excerpt: "After years of VS Code loyalty, I made the switch to Neovim. Here's what I learned, what I lost, and what I gained.",
    content: `# Why I Switched from VS Code to Neovim\n\nIt started as a weekend experiment. It became a lifestyle change.\n\n## The Setup\n\nI had been using VS Code for five years. Extensions, themes, keybindings — I had it dialed in perfectly. So why change?\n\n## The Itch\n\nSpeed. VS Code, with 40+ extensions, was starting to feel sluggish on large projects. I'd heard the Neovim evangelists preach for years. I finally listened.\n\n## Week One: Pain\n\nI won't sugarcoat it. The first week was brutal. Basic operations that took one keystroke in VS Code required me to Google how to do them in Vim. My productivity dropped by 60%.\n\n## Week Three: The Click\n\nSomething clicked around day 18. I stopped thinking about the commands and started thinking about the code. The modal editing paradigm finally made sense.\n\n## What I Gained\n\n- **Speed**: Navigating large codebases is genuinely faster\n- **Focus**: No GUI distractions, just text\n- **Customization**: Lua config is a joy to write\n\n## What I Miss\n\n- Integrated Git UI\n- The extension ecosystem\n\n## Verdict\n\nFor someone who spends 8+ hours a day in a text editor, the investment paid off. For casual coders — stick with VS Code.`,
    author: 'Dev Patel',
    tags: ['developer', 'tools', 'neovim', 'vscode'],
    createdAt: new Date('2026-03-20').toISOString(),
    updatedAt: new Date('2026-03-21').toISOString(),
    readTime: 6,
    coverColor: '#10b981',
  },
];

const BlogContext = createContext(null);

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState(SAMPLE_POSTS);

  const getPost = useCallback((id) => posts.find((p) => p.id === id), [posts]);

  const createPost = useCallback((data) => {
    const now = new Date().toISOString();
    const words = (data.content || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
    const newPost = {
      id: Date.now().toString(),
      ...data,
      readTime,
      createdAt: now,
      updatedAt: now,
      coverColor: data.coverColor || colors[Math.floor(Math.random() * colors.length)],
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  const updatePost = useCallback((id, data) => {
    const words = (data.content || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, readTime, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const deletePost = useCallback((id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <BlogContext.Provider value={{ posts, getPost, createPost, updatePost, deletePost }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  return useContext(BlogContext);
}
