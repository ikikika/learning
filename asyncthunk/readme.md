## Extra reducers

- Watch for additional action types
- Used when we want to make a state change that is not controlled by the slice

```
const movieSlice = createSlice({
  name: "movie",
  initialState: [],
  reducers: {
    ...
    reset: (state, action) => {
      return [];
      // if we want to clear the state, do this instead of state = []
    },
  },
});

const musicSlice = createSlice({
  name: "music",
  initialState: [],
  reducers: {
    ...
  },
  extraReducers: (builder) => {
    builder.addCase(movieSlice.actions.reset, (state, action) => {
        return [];
    })
    // this funciton will run whenever "movie/reset" is called, watch for "movie/reset"
  }
});

```

## Manual Action Creation

- if we want to make an action that changes the state of both movie and music, but independent of actions within movie and music

```
export const reset = createAction("app/reset");

const movieSlice = createSlice({
  name: "movie",
  initialState: [],
  reducers: {
    ...
  },
  extraReducers: (builder) => {
    builder.addCase(reset, (state, action) => {
        return [];
    })
  }
});

const musicSlice = createSlice({
  name: "music",
  initialState: [],
  reducers: {
    ...
  },
  extraReducers: (builder) => {
    builder.addCase(reset, (state, action) => {
        return [];
    })
  }
});

// in component, import {reset}
// call dispatch(reset())

```

## File structure

```
src/
  components/
    Movies.tsx
    Songs.tsx
  store/
    slices/
      movieSlice.ts
      songSlice.ts
    actions.ts
    index.ts
  App.tsx
  index.tsx
```

## Options for data fetching in redux toolkit

- async thunk functions
- redux toolkit query

### DO NOT MAKE REQUESTS IN REDUCERS

- reducers should always be 100% synchronous
- reducers should only operate on their arguments - no outside variables

## Steps for adding a thunk

- The word "thunk" is a programming term that means "a piece of code that does some delayed work". Rather than execute some logic now, we can write a function body or code that can be used to perform the work later.
- For Redux specifically, "thunks" are a pattern of writing functions with logic inside that can interact with a Redux store's dispatch and getState methods.
- async thunk automatically dispatch actions during data loading

1. Create a new file for the thunk. Name it after the purpose of the request.
2. Create the thunk. Give it a base type that describes the purpose of the request.
3. In the thunk, make the request, return the data that you want to use in the reducer.
4. In the slice, add extraReducers, watching for the action types made by the thunk.
5. Export the thunk from the store/index.ts file
6. When a user does something, dispatch the thunk function to run it

## Handling local loading states

DO NOT CALL SET LOADING IMMEDIATELY AFTER DISPATCH

```
setIsLoading(true);
dispatch(fetchUsers());
setIsLoading(false);
// BAD
```

`unwrap` turns `dispatch` into a conventional promise function where we can chain on `.then()` and `.catch()`

```
setIsLoading(true);
dispatch(fetchUsers())
  .unwrap()
  .then(() => console.log('success))
  .catch((err) => setError(err))
  .finally(() => setIsLoading(false))
// good
```

# Redux Toolkit Query

## API

- Code that go and fetch some data
- Not a backend server

## Hooks

Query

- making a request specifically to read or fetch some data

Mutation

- making a request to chagne or write some data

```
import { cretaApi } from "@reduxjs/toolkit/query/react;

const albumsApi = createApi({
  endpoints(builder){
    return {
      fetchAlbums: /* Instructions on how to make a req to fetch albums */,
      addAlbum: /* Instructions on how to make a req to add an album */,
      removeAlbum: /* Instructions on how to make a req to remove an album */
    }
  }
})

// These hooks will be automatically generated

export {
  useFetchAlbumQuery
  useAddAlbumMutation,
  useRemoveAlbumMutation
}
```

These hooks are used like this to return data fetched, error, and isLoading boolean.

```
const { data, error, isLoading} = useFetchAlbumQuery();
```

## Create a RTK Query

1. Identify a group of related requests that your app needs to make
2. Make a new file that will create the api
3. The API needs to store a ton of state related to data, request status, errors. Add a '**reducerPath**'.
4. The API needs to know how and where to send requests. Add a '**baseQuery**'.
5. Add '**endpoints**', one for each kind of request you want to make. Reqs that read data are queries, write data are mutations.
6. Export all of the automatically generated hooks.
7. Connect API to store. Reducer, middleware and listeners.
8. Export hooks from store/index.js file.

Step 1: Make fetch, create and delete apis for albums and photos.

```
State = {
  users: {
    isLoading: false,
    error: null,
    data: []
  },
  // reducerPath - property on the big state object where all of the API state should be maintained
  // tons of state added by the API to handle requests
  albums: {
    queries: { /* stuff */ },
    mutations: { /* stuff */ }
    provided: { /* stuff */ },
    subscriptions: { /* stuff */ },
    config: { /* stuff */ }
  }
}
```
