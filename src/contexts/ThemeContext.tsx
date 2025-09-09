import { type FC, type ReactNode, useState, useEffect } from 'react';
import { type ThemeMode, type ThemeColor, type ThemeConfig, getThemeColors } from '@/config/themes';
import { ThemeContext, type ThemeContextType } from './ThemeContextInstance';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>({ mode: 'dark', color: 'blue' });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('expense-tracker-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme) as ThemeConfig;
        setTheme(parsedTheme);
      } catch {
        // Use default theme if parsing fails
        setTheme({ mode: 'dark', color: 'blue' });
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('expense-tracker-theme', JSON.stringify(theme));
    
    // Update CSS custom properties for dynamic theming
    const colors = getThemeColors(theme.mode, theme.color);
    document.documentElement.style.setProperty('--theme-background', colors.background);
    document.documentElement.style.setProperty('--theme-surface', colors.surface);
    document.documentElement.style.setProperty('--theme-surface-secondary', colors.surfaceSecondary);
    document.documentElement.style.setProperty('--theme-text', colors.text);
    document.documentElement.style.setProperty('--theme-text-secondary', colors.textSecondary);
    document.documentElement.style.setProperty('--theme-text-muted', colors.textMuted);
    document.documentElement.style.setProperty('--theme-border', colors.border);
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    document.documentElement.style.setProperty('--theme-accent', colors.accent);
  }, [theme]);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setThemeColor = (color: ThemeColor) => {
    setTheme(prev => ({ ...prev, color }));
  };

  const value: ThemeContextType = {
    theme,
    setThemeMode,
    setThemeColor,
    themeColors: getThemeColors(theme.mode, theme.color),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

