// Step 2: Make a new file that will create the api

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { faker } from "@faker-js/faker";

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
      addAlbum: builder.mutation({
        query: (user) => {
          return {
            url: "/albums",
            method: "POST",
            body: {
              userId: user.id,
              title: faker.commerce.productName(),
            },
          };
        },
      }),
    };
  },
});

// step 6: export automatically generated hook
export const { useFetchAlbumsQuery, useAddAlbumMutation } = albumsApi;
export { albumsApi };
