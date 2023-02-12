## Better API

### 1A. Filtering

1. mongoose has built in filtering functions
1. passed in as query parameters
   eg. `?&difficulty=easy&duration=2`
   interpreted by mongoose as `{ difficulty: 'easy', duration: '2' }`

### 1B. Advanced filtering

- its also possible to set a query range
  eg. `?difficulty=easy&duration[gte]=2`
  interpreted by mongoose as `{ difficulty: 'easy', duration: { gte: '5' } }`
  add `$` to `gte` to make it an operator

  - `gte`: greater than or equal
  - `gt`: greater than
  - `lte`: less than or equal
  - `lt`: less than

- regex: `/\b(gte|gt|lte|lt)\b/g`

  - start with `//`
  - put in strings to identify `/(get|gt|lte|lt)/`
  - enclose with `\b` to denote we only want to match exactly those strings and not if they are part of anotehr word `/\b(get|gt|lte|lt)\b/`
  - end with `g` to denote that each string might occur more than once `/\b(gte|gt|lte|lt)\b/g`

- should be documented if api is live

### 2A. Sorting

- `?sort=price` for ascending
- `?sort=-price` for descending

### 2B. Sorting by multiple keys

- `?sort=price,ratings`
- must be formatted to `price ratings` to be passed into query

### 3. Limiting fields

- `?fields=name,duration,difficulty,price`
- use `-` to exclude, eg `?fields=-name,-duration` will return results without `name` and `duration`
- replace comma with space to be passed into query

- `select: false` can be set from schema to permanently remove from all queries

### 4. Pagination

- `?page=2limit=10`
- need to calculate how many results to skip and how many results to display

### 5. Alias

- use middleware to replace some certain queries for better user experience
- eg `/top-5-cheapest` can be used to replace `?limit=5&sort=-ratingAverage,price`

## Aggregation

- Define a pipeline that all documents from a certain collection go through where they are processed step by step to transform them into aggregated results
- Eg, aggregation pipelines can be used to calculate averages, maximum, minimum values, distances, etc.
- https://www.mongodb.com/docs/manual/aggregation/
- https://www.mongodb.com/docs/manual/reference/operator/query/
- https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/

- `$unwind`: deconstruct an array field from the input document and then output one document for each element of the array
  eg, if we want to break down data into months and see which month has the highest/lowest count

## Virtual Properties

- fields that we can define on our schema but will not be saved into the database
- make a lot of sense for fields that can be derived from one another.
  eg, a conversion from miles to kilometers.
- must use regular function because we need `this` keyword
- cannot use virtual properties in a query because they are not part of the database
- we can do this in controller but thats not good practie as we want to keep business logic separate from application logic
- fat models: as much business logic as we can offload to them, thin coltrollers: as little business logic as possible
