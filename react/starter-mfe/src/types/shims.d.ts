declare module '@active-routes' {
  import type { RouteObject } from 'react-router';
  export const routes: RouteObject[];
}

declare const __STARTER_ROLE__: 'standalone' | 'shell' | 'remote' | undefined;
declare const __STARTER_DEMO_REMOTE_URL_DEFAULT__: string | undefined;

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
