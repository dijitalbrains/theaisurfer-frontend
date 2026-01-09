import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleTheme } from '../../redux/slices/themeSlice';

export const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-xl glass-dark hover:scale-110 transition-all duration-200 border border-white/20"
      aria-label="Toggle theme"
    >
      {mode === 'dark' ? (
        <Sun className="w-5 h-5 text-accent-orange" />
      ) : (
        <Moon className="w-5 h-5 text-primary-500" />
      )}
    </button>
  );
};
