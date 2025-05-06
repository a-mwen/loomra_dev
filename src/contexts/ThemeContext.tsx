import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SettingsContextType } from './settingsContext'; // Import the type

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create a context for accessing settings without using hooks
let settingsContextValue: SettingsContextType | undefined;

export const registerSettings = (settings: SettingsContextType) => {
  settingsContextValue = settings;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Keep your existing initialization logic
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as Theme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Handle initializing from settings when they become available
  useEffect(() => {
    if (settingsContextValue && 
        settingsContextValue.settings.appearance &&
        settingsContextValue.settings.appearance.theme !== theme) {
      // If settings are loaded and different from current theme, update local state
      const settingsTheme = settingsContextValue.settings.appearance.theme;
      if (settingsTheme === 'light' || settingsTheme === 'dark') {
        setThemeState(settingsTheme);
      }
    }
  }, [settingsContextValue, theme]);

  // Keep your existing effect for applying theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
    
    // Add this to sync with settings when theme changes
    if (settingsContextValue && 
        settingsContextValue.settings.appearance &&
        settingsContextValue.settings.appearance.theme !== theme) {
      settingsContextValue.updateSettings({
        appearance: {
          ...settingsContextValue.settings.appearance,
          theme
        }
      }).catch((updateError: Error) => {
        console.error('Failed to update theme in settings:', updateError);
      });
    }
  }, [theme]);

  // Create the setTheme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Keep your existing toggle function
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};