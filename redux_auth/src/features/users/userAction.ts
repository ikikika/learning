import { apiService } from "../../app/services/apiService";

export const usersAction = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetUsersQuery } = usersAction;
