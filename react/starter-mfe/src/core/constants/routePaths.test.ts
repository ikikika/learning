import { routePaths, composeChildPath } from './routePaths';

describe('routePaths', () => {
  it('compose.mount starts with compose.segment', () => {
    expect(
      routePaths.compose.mount.startsWith(routePaths.compose.segment),
    ).toBe(true);
  });

  it('composeChildPath builds /{segment}/{alias}', () => {
    expect(composeChildPath('demoRemote')).toBe(
      `/${routePaths.compose.segment}/demoRemote`,
    );
  });
});
