/**
 * Relative API path helpers (joined with `API_BASE_URL` via `apiUrl`).
 */
export const apiRoutes = {
  posts: {
    byId: (id: number | string) => `/posts/${id}`,
  },
} as const;
