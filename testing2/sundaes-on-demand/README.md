## Tests

- More complex user interactions
  - Multiple form entry, moving through order phases
- Mouseover popup
  - test that element disappears from DOM
- Simulating server response
  - Mock service worker
- Async app updates
  - Awaiting DOM changes
- Global state via context

## `userEvent`

- Newer version
- Always returns a promise

## `screen` query methods:

- made up of command[All]ByQueryType
- mix and match

1. command

- `get`: expect element to be in DOM
- `query`: expect element not to be in DOM
- `find`: expect element to appear async

2. [All]

- (if exclude) expect only one match
- (if include) expect more than one match

3. QueryType

- `Role` (most preferred)
- `AltText` (images)
- `Text` (static non-intereactive display elements)
- Form elements
  - `PlaceholderText`
  - `LabelText`
  - `DisplayValue`

## Mock service worker

- Mimic response from server
- Create handler
  - https://mswjs.io/docs/getting-started/mocks/rest-api
  - `rest.get('url', (req, res, ctx) => {})`
  - `req`, an information about a matching request;
  - `res`, a functional utility to create the mocked response;
  - `ctx`, a group of functions that help to set a status code, headers, body, etc. of the mocked response.
- Create mock server
  - https://mswjs.io/docs/getting-started/integrate/node
- Update `./src/setupTests.js` to listen for request during testing and reset handlers after any tests

## Context file

- make context with `createContext`
- make custom hook with `useContext`
- make context provider with internal state via `useState`
  - provider value state getters and setters
- export custom hook and provider

## Custom render

- create custom wrapper to wrap provider by default
- https://testing-library.com/docs/react-testing-library/setup/#custom-render

## Jest mocks as props

- Example, when we add a component as a prop
  - typescript will require the component type to be a function
  - certain tests may error if component not defined in test
- `jest.fn`
  - does not do anything
  - placeholder to avoid errors
