declare module '@active-routes' {
  import type { RouteObject } from 'react-router';
  export const routes: RouteObject[];
}

declare const __STARTER_ROLE__:
  'standalone' | 'host' | 'remote' | 'hybrid' | undefined;
declare const __STARTER_DEMO_REMOTE_URL_DEFAULT__: string | undefined;
declare const __STARTER_REMOTES_CONFIG__:
  | Array<{
      alias: string;
      name: string;
      federationName: string;
      expose: string;
      urlEnv: string;
    }>
  | undefined;
declare const __STARTER_REMOTES_URLS__: Record<string, string> | undefined;

declare namespace NodeJS {
  interface ProcessEnv {
    API_BASE_URL?: string;
  }
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const css: string;
  export default css;
}

declare module '*.css' {
  const css: string;
  export default css;
}
