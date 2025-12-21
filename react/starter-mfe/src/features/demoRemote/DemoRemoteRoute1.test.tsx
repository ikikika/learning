import { render, screen } from '@testing-library/react';
import { DemoRemoteRoute1 } from './DemoRemoteRoute1';

describe('DemoRemoteRoute1', () => {
  it('renders Route 1 heading and sample copy', () => {
    render(<DemoRemoteRoute1 />);
    expect(screen.getByTestId('demo-remote-route-1')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Route 1' }),
    ).toBeInTheDocument();
  });
});
