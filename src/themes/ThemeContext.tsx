import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

// 1. Define the shape of your context value
interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// 2. Create context with a fallback (will be overridden by the provider)
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// 3. Define props type for the provider
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const getInitialTheme = (): boolean => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Custom hook to use context
export function useTheme() {
  return useContext(ThemeContext);
}
