## How

- Test the software the way users actually use it
  - not internal implementations
- Find elements by accessibility markers, not test IDs

## Unit testing functions

- Functions separate from components
  - used by several components
  - complex logic
- Unit test if
  - complex logic difficult to test via functional tests
  - too many edge cases

## Review

- Test interactivity using `fireEvent`
- jest-dom assertions
  - `toBeEnabled()`
  - `toBeDisabled()`
  - `toBeChecked()`
- `getByRole` option `{ "role", name: "" }`
- jest `describe` to group tests
