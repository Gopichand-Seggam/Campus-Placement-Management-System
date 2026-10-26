import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="icon-theme-toggle" onClick={toggleTheme} title="Toggle Theme">
      <div className="icon-theme-track">
        <div className="icon-theme-thumb">
          {theme === 'dark' ? <Moon size={14} color="white" /> : <Sun size={14} color="#f59e0b" />}
        </div>
      </div>
    </div>
  );
}
