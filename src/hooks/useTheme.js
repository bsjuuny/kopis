import { useState, useEffect } from 'react';

/**
 * useTheme — manages dark/light mode preference.
 * Persists to localStorage, falls back to OS preference.
 * Sets data-theme attribute on <html> element.
 */
export function useTheme() {
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setThemeState(prev => prev === 'dark' ? 'light' : 'dark');

    return { theme, toggleTheme };
}
