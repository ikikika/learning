## Extra reducers

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
    // this funciton will run whenever "movie/reset" is called
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
