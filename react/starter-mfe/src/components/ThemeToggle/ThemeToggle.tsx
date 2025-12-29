import { Button } from '../Button';
import { useTheme } from '@/app/providers/ThemeProvider';
import styles from './ThemeToggle.module.scss';
import type { ThemeToggleProps } from './types';

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, useSystemTheme } = useTheme();

  return (
    <div className={[styles.group, className].filter(Boolean).join(' ')}>
      <span className={styles.label}>Theme</span>
      <Button
        variant={theme === 'light' ? 'primary' : 'secondary'}
        onClick={() => setTheme('light')}
        aria-label="Use light theme"
      >
        Light
      </Button>
      <Button
        variant={theme === 'dark' ? 'primary' : 'secondary'}
        onClick={() => setTheme('dark')}
        aria-label="Use dark theme"
      >
        Dark
      </Button>
      <Button
        variant="ghost"
        onClick={useSystemTheme}
        aria-label="Use system theme"
      >
        Use system theme
      </Button>
    </div>
  );
}
