import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nightlog-theme';
const FONT_SIZE_STORAGE_KEY = 'nightlog-font-size';
const HIGH_CONTRAST_STORAGE_KEY = 'nightlog-high-contrast';

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: '14px',
  medium: '16px',
  large: '19px',
};

const FONT_SIZE_ORDER: FontSize[] = ['small', 'medium', 'large'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const stored = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (stored === 'small' || stored === 'medium' || stored === 'large') return stored;
    return 'medium';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_MAP[fontSize];
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-high-contrast', '');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
    localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(highContrast));
  }, [highContrast]);

  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  const increaseFontSize = () => {
    setFontSizeState((prev) => {
      const idx = FONT_SIZE_ORDER.indexOf(prev);
      return idx < FONT_SIZE_ORDER.length - 1 ? FONT_SIZE_ORDER[idx + 1] : prev;
    });
  };

  const decreaseFontSize = () => {
    setFontSizeState((prev) => {
      const idx = FONT_SIZE_ORDER.indexOf(prev);
      return idx > 0 ? FONT_SIZE_ORDER[idx - 1] : prev;
    });
  };

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
