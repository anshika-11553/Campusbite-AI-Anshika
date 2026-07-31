'use client';

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusbite-theme') as 'light' | 'dark';
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
        return 'dark';
      }
    }
    return 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('campusbite-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
