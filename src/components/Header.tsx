'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('ai-dashboard-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('ai-dashboard-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center" role="banner">
      <div className="flex items-center space-x-3">
        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" aria-hidden="true" />
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Chat Dashboard
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-xs mono muted bg-transparent px-3 py-1.5 rounded-md border" aria-live="polite">
          Status: <span className="text-success">Connected</span>
        </div>
        <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-[var(--surface-2)]">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}