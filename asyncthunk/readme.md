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
- async thunk automatically dispatched actions during data loading

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
