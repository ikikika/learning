import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { THEME_STORAGE_KEY } from '@/core/constants/theme';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles light/dark and exposes use-system control', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    await user.click(screen.getByLabelText('Use dark theme'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    await user.click(screen.getByLabelText('Use system theme'));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
