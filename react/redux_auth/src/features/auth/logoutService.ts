import { apiService } from "../services/apiService";

export const logoutService = apiService.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.query({
      query: () => "/logout",
    }),
  }),
});

export const { useLazyLogoutQuery } = logoutService;
