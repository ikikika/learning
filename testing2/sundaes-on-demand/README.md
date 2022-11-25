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
