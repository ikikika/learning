import { render, screen } from '@testing-library/react';
import { DemoHost } from './DemoHost';

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

describe('DemoHost', () => {
  it('always shows Host nav link', () => {
    render(<DemoHost />);
    expect(screen.getByRole('link', { name: 'Host' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('shows a nav link for each REMOTE_SLOTS name', () => {
    render(<DemoHost />);
    expect(screen.getByRole('link', { name: 'Billing' })).toHaveAttribute(
      'href',
      '/app/billingRemote',
    );
  });
});
