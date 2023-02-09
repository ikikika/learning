## Filtering

1. mongoose has built in filtering functions
1. passed in as query parameters
   eg. `?&difficulty=easy&duration=2`
   interpreted by mongoose as `{ difficulty: 'easy', duration: '2' }`

## ADvanced filtering

1. its also possible to set a query range
   eg. `?difficulty=easy&duration[gte]=2`
   interpreted by mongoose as `{ difficulty: 'easy', duration: { gte: '5' } }`
   add `$` to `gte` to make it an operator

   - `gte`: greater than or equal
   - `gt`: greater than
   - `lte`: less than or equal
   - `lt`: less than

1. regex: `/\b(gte|gt|lte|lt)\b/g`

- start with `//`
- put in strings to identify `/(get|gt|lte|lt)/`
- enclose with `\b` to denote we only want to match exactly those strings and not if they are part of anotehr word `/\b(get|gt|lte|lt)\b/`
- end with `g` to denote that each string might occur more than once `/\b(gte|gt|lte|lt)\b/g`

1. should be documented if api is live
