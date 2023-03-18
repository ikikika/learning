import { apiService } from "../services/apiService";

export const refreshService = apiService.injectEndpoints({
  endpoints: (builder) => ({
    refresh: builder.query({
      query: () => "/refresh",
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useRefreshQuery } = refreshService;
