// App setup has moved to app.ts. Server bootstrap is in server.ts.
// This file re-exports the app instance for convenience (e.g. supertest imports).
export { default } from './app';
