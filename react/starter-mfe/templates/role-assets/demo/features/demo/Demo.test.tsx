import { render, screen } from '@testing-library/react';
import { Demo, CONTRACT_VERSION } from './index';

describe('Demo', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('exports contract version 1.0.0', () => {
    expect(CONTRACT_VERSION).toBe('1.0.0');
  });

  it('embedded={true} does not apply document data-theme', () => {
    const before = document.documentElement.getAttribute('data-theme');
    render(<Demo embedded title="Embedded" />);
    expect(screen.getByTestId('demo-feature')).toHaveAttribute(
      'data-embedded',
      'true',
    );
    expect(document.documentElement.getAttribute('data-theme')).toBe(before);
  });
});
