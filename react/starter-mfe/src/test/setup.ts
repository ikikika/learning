import '@testing-library/jest-dom';

process.env.API_BASE_URL =
  process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com/';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
