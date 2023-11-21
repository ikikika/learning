// Step 2: Make a new file that will create the api

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { faker } from "@faker-js/faker";

// DEV ONLY!!!
const pause = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const albumsApi = createApi({
  // step 3: add reducerPath
  reducerPath: "albums",
  // step 4: add baseQuery
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3005",
    fetchFn: async (...args) => {
      // DEV ONLY!!!
      await pause(1000);
      return fetch(...args);
    },
  }),
  tagTypes: ["Album", "UsersAlbums"],
  // step 5: add enpoints from analysis
  endpoints(builder) {
    return {
      // point a, point b
      fetchAlbums: builder.query({
        providesTags: (result, error, arg) => {
          // arg is whatever u pass into ur hook. in this case, its user
          const tags = result.map((album: { id: number }) => {
            return { type: "Album", id: album.id };
          });
          tags.push({ type: "UsersAlbums", id: arg.id });
          return tags;
        },
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
        invalidatesTags: (result, error, user) => {
          return [{ type: "UsersAlbums", id: user.id }];
        },
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
      removeAlbum: builder.mutation({
        invalidatesTags: (result, error, album) => {
          return [{ type: "Album", id: album.id }];
        },
        query: (album) => {
          return {
            url: `/albums/${album.id}`,
            method: "DELETE",
          };
        },
      }),
    };
  },
});

// step 6: export automatically generated hook
export const {
  useFetchAlbumsQuery,
  useAddAlbumMutation,
  useRemoveAlbumMutation,
} = albumsApi;
export { albumsApi };
