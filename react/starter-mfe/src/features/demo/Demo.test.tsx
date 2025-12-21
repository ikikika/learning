import { render, screen, waitFor } from '@testing-library/react';
import { Demo, CONTRACT_VERSION } from './index';

describe('Demo', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      text: async () =>
        JSON.stringify({
          userId: 1,
          id: 1,
          title: 'test title',
          body: 'test body',
        }),
      json: async () => ({
        userId: 1,
        id: 1,
        title: 'test title',
        body: 'test body',
      }),
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it('renders /posts/1 response as plain text', async () => {
    render(<Demo />);
    await waitFor(() => {
      expect(screen.getByTestId('demo-post')).toHaveTextContent('test title');
    });
  });
});
