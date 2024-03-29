import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../auth/authSlice";
import { RootState } from "../../app/store";

export const basicQueryFunction = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include", // send with httponly cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// wrapper such that new access token created when auth fail
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await basicQueryFunction(args, api, extraOptions);

  if (result.error) {
    if ("originalStatus" in result.error) {
      if (result.error.originalStatus === 403) {
        console.log("sending refresh token");
        // send refresh token to get new access token
        const refreshResult = await basicQueryFunction(
          "/refresh",
          api,
          extraOptions
        );
        // console.log(refreshResult);
        if (refreshResult?.data) {
          const user = (api.getState() as RootState)!.auth.user;
          // store the new token
          api.dispatch(setCredentials({ ...refreshResult.data, user }));
          // retry the original query with new access token
          result = await basicQueryFunction(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      }
    }
  }

  // if (result.error) {
  //   api.dispatch(logOut());
  // }

  return result;
};

export const apiService = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
