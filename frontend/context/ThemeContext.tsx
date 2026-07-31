'use client';

import React, { createContext, useContext, useState } from 'react';
import { ThemeConfig, defaultThemeConfig } from '@/config/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  setMode: (mode: ThemeConfig['mode']) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultThemeConfig);

  const setMode = (mode: ThemeConfig['mode']) => {
    setTheme((prev) => ({ ...prev, mode }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
