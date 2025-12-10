/**
 * Public props for the federated `./Demo` expose.
 * When `embedded={true}`, Demo MUST NOT apply document `data-theme`
 * or register a competing service worker.
 */
export type DemoProps = {
  embedded?: boolean;
  title?: string;
};
