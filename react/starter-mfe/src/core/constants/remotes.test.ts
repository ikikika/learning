import {
  getRemotePropsFromMap,
  mergeRemoteMountProps,
} from './remotes';

describe('getRemotePropsFromMap', () => {
  it('returns bag for known alias', () => {
    expect(
      getRemotePropsFromMap(
        { demoRemote: { title: 'A' }, billingRemote: { title: 'B' } },
        'demoRemote',
      ),
    ).toEqual({ title: 'A' });
  });

  it('returns {} for orphan / unknown alias', () => {
    expect(
      getRemotePropsFromMap({ orphanAlias: { title: 'x' } }, 'demoRemote'),
    ).toEqual({});
    expect(getRemotePropsFromMap({}, 'missing')).toEqual({});
    expect(getRemotePropsFromMap(undefined, 'demoRemote')).toEqual({});
  });
});

describe('mergeRemoteMountProps', () => {
  it('strips bag embedded and forces embedded true', () => {
    expect(
      mergeRemoteMountProps({ title: 'Hello', embedded: false }),
    ).toEqual({ title: 'Hello', embedded: true });
  });

  it('works with empty bag', () => {
    expect(mergeRemoteMountProps({})).toEqual({ embedded: true });
  });
});
