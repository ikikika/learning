import { DemoHost } from '@/features/demoHost';

/**
 * Host home — mounts demoHost chrome. Does not import features/demo.
 */
export function DemoHostHomePage() {
  return <DemoHost />;
}
