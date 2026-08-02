import { render, screen } from '@testing-library/react';
import { RemoteFallback } from './RemoteFallback';

describe('RemoteFallback', () => {
  it('shows alert fallback', () => {
    render(<RemoteFallback reason="unreachable" />);
    expect(screen.getByTestId('remote-fallback')).toHaveTextContent(
      'unreachable',
    );
  });
});
