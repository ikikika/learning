import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../app/providers/ThemeProvider';
import { DemoHybridHome } from './DemoHybridHome';

jest.mock('react-router', () => ({
  NavLink: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string | ((args: { isActive: boolean }) => string);
  }) => {
    const cls =
      typeof className === 'function'
        ? className({ isActive: false })
        : className;
    return (
      <a href={to} className={cls}>
        {children}
      </a>
    );
  },
  Outlet: () => <div data-testid="outlet" />,
}));

jest.mock('../../core/constants/remotes', () => ({
  REMOTE_SLOTS: [
    {
      alias: 'billingRemote',
      name: 'Billing',
      federationName: 'billing',
      expose: './Billing',
      urlEnv: 'BILLING_REMOTE_URL',
      get url() {
        return 'http://127.0.0.1:3003/remoteEntry.js';
      },
    },
  ],
}));

describe('DemoHybridHome', () => {
  it('renders the distinct hybrid header band', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('demo-hybrid-header-band')).toBeInTheDocument();
  });

  it('always shows Hybrid nav link (relative mount home)', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome />
      </ThemeProvider>,
    );
    expect(screen.getByRole('link', { name: 'Hybrid' })).toHaveAttribute(
      'href',
      '.',
    );
  });

  it('shows a relative nav link for each REMOTE_SLOTS name', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome />
      </ThemeProvider>,
    );
    expect(screen.getByRole('link', { name: 'Billing' })).toHaveAttribute(
      'href',
      'billingRemote',
    );
  });

  it('shows the theme toggle by default', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole('button', { name: 'Use light theme' }),
    ).toBeInTheDocument();
  });

  it('suppresses the theme toggle when embedded', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome embedded />
      </ThemeProvider>,
    );
    expect(
      screen.queryByRole('button', { name: 'Use light theme' }),
    ).not.toBeInTheDocument();
  });

  it('suppresses the theme toggle when showThemeToggle is false', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome showThemeToggle={false} />
      </ThemeProvider>,
    );
    expect(
      screen.queryByRole('button', { name: 'Use light theme' }),
    ).not.toBeInTheDocument();
  });

  it('shows an optional composer-provided title', () => {
    render(
      <ThemeProvider>
        <DemoHybridHome title="Acme Shell" />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('demo-hybrid-host-title')).toHaveTextContent(
      'Acme Shell',
    );
  });
});
