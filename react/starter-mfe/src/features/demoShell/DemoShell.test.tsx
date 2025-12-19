import { render, screen } from '@testing-library/react';
import { DemoShell } from './DemoShell';

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

describe('DemoShell', () => {
  it('always shows Shell nav link', () => {
    render(<DemoShell />);
    expect(screen.getByRole('link', { name: 'Shell' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('shows a nav link for each REMOTE_SLOTS name', () => {
    render(<DemoShell />);
    expect(screen.getByRole('link', { name: 'Billing' })).toHaveAttribute(
      'href',
      '/remote/billingRemote',
    );
  });
});
