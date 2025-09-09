import { createContext } from 'react';
import { type ThemeMode, type ThemeColor, type ThemeConfig, getThemeColors } from '@/config/themes';

export interface ThemeContextType {
  theme: ThemeConfig;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: (color: ThemeColor) => void;
  themeColors: ReturnType<typeof getThemeColors>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
