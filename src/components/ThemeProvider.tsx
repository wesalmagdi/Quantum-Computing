'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type ThemeContext = { dark: boolean; toggle: () => void };
const Ctx = createContext<ThemeContext>({ dark: false, toggle: () => {} });
export const useTheme = () => useContext(Ctx);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ dark, toggle }}>{children}</Ctx.Provider>;
}
