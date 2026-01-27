import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeContext();

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    theme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
  };
};
