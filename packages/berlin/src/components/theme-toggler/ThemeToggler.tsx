import { useEffect } from 'react';
import { useAppStore } from '@/store';
import Icon from '../icon';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggler() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <Icon onClick={toggleTheme}>{theme === 'dark' ? <Sun /> : <Moon />}</Icon>;
}
