import { DemoHybridHome } from '@/features/demoHybrid';

/**
 * Hybrid own-app home — mounts demoHybrid chrome. `MainLayout` already
 * supplies the document-level theme toggle for own-app entries, so the
 * hybrid header band's own toggle stays hidden here to avoid a duplicate
 * control. Does not import features/demo or features/demoHost.
 */
export function DemoHybridHomePage() {
  return <DemoHybridHome showThemeToggle={false} />;
}
