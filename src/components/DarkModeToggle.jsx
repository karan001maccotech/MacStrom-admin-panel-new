import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react'; // optional icons

const DarkModeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition"
    >
      {darkMode ? <Sun className="text-yellow-300" /> : <Moon className="text-gray-700" />}
    </button>
  );
};

export default DarkModeToggle;
