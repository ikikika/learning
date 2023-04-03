// Step 2: Make a new file that will create the api

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const albumsApi = createApi({
  // step 3: add reducerPath
  reducerPath: "albums",
  // step 4: add baseQuery
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3005",
  }),
  // step 5: add enpoints from analysis
  endpoints(builder) {
    return {
      // point a, point b
      fetchAlbums: builder.query({
        query: (user) => {
          return {
            url: "/albums", // point c
            params: {
              // point d
              userId: user.id,
            },
            method: "get", // point e
          };
        },
      }),
    };
  },
});
