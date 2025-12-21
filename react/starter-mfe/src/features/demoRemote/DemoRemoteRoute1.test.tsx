import { render, screen } from '@testing-library/react';
import { DemoRemoteRoute1 } from './DemoRemoteRoute1';
import { HostPropsProvider } from './HostPropsContext';

jest.mock('react-router', () => ({
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
  useParams: () => ({}),
}));

describe('DemoRemoteRoute1', () => {
  it('renders Route 1 heading and sample copy without host title', () => {
    render(<DemoRemoteRoute1 />);
    expect(screen.getByTestId('demo-remote-route-1')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Route 1' }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('demo-remote-host-title')).toBeNull();
  });

  it('shows demo-remote-host-title when context title is set', () => {
    render(
      <HostPropsProvider value={{ title: 'From Shell A' }}>
        <DemoRemoteRoute1 />
      </HostPropsProvider>,
    );
    expect(screen.getByTestId('demo-remote-host-title')).toHaveTextContent(
      'From Shell A',
    );
  });
});
