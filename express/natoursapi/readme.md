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

## Middleware

- we can use Mongoose middleware to make something happen between two events.
- for eg, each time a new document is saved to the database, we can run a function between the save command is issued and the actual saving of the document, or also after the actual saving.
- also called pre and post hooks
- 4 types: document, query, aggregate, and model middleware.

### Document Middleware

- middleware that can act on the currently processed document.
- define a middleware on the schema,
- `.pre` ONLY runs before `.save()` and `.create()`. not `insert`, etc
- end with `next()` to move on to the next middleware function
- `post` middleware do not have access toi `this`, but have access to `doc`, which is the saved document

### Query Middlware

- pre-find hook, a middleware that is gonna run before any find query is executed.
- can be used to find out how long a query took to run

### Aggregation Middleware

- allows us to add hooks before or after an aggregation happens
- eg, we dont want to count secret tours in our aggregation stats

## Validation

- Model is good place to do validation: fat model, thin controller
- built in validators
- custom validators
  - validator function `this` keyword in model only works when creating new document, not when updating existing document
- also can use package like `validator` by chriso

## Debugging

- use ndb tool
- previosuly we need to use console logs
- can set breakpoints in the code to freeze the code while its running to see whats wrong
- once code hit breakpoint, we can step forward to identify line that contains error

## Error Handling

- unhandled routes
- implement a global error handling middleware
- In production, dun send too much error details to client
- in error controller, we can implement more features:
  - rank errors in terms of importance
  - email administrators should error be encountered, etc

## Authentication

- JWT secret shoiuld be 32 characters long
- JWT expires time can be 90d, 10h, 10h, 5m, 3s
- instance method: a method taht is availabel on all documents of the collection

- Typing for user
  - https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
  - https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type

### Protecting routes

- use a middleware on route

### Update user

- Use different routes to update user info and passwords

### Delete user

- Not actually removing records from db
- Set active = false in db
- Use model middleware to filter out deleted records so that they do not show up on find queries, including login

## Security

### Vulnerabilities

- Compromised database

  - &#9745; Strongly encrypt passwords with salt and hash (`bcrypt`)
  - &#9745; Strongly encrypt password reset tokens

- Brute force attacks

  - &#9745; use `bcrypt` (to make login requests slow)
  - Implement rate limiting (`express-rate-limiting`) (will implement)
    - limit no of requests from 1 single IP
  - Implement maximum login attempts

- Cross-site scripting (XSS) attacks

  - Attacker tries to inject scripts into our page to run his malicious code
  - Never ever store the JSON web token in local storage.
  - Store JWT in HTTPOnly cookies (will implement)
    - browser can only receive and send the cookie but cannot access or modify it in any way
    - makes it more difficult for attacker to steal JWT in cookie
  - Sanitize user input data
  - Set special HTTP headers (`helmet` package)

- Denial of service (DOS) attacks

  - Implement rate limiting (`express-rate-limiting`)
  - Limit body payload (in `body-parser`)
  - &#9745; Avoid evil regex (regex that take an exponential time to run for non-matching inputs and they can be exploited to bring our entire application down.)

- NoSQL query injection
  - &#9745; Use `mongoose` for MongoDB (instead of SchemaTypes)
  - Sanitize user input data (will implement)

### Best Practices and Suggestions

- &#9745; Always use HTTPS
- &#9745; Create random password reset tokens with expiry dates
- &#9745; Deny access to JWT after password cahnge
- &#9745; Dun commit sensitive config data to GIT
- &#9745; Dun send error details to clients
- Prevent cross site request forgery (`csurf` package)
- Require re-authentication before high-value action (eg making payment or deleting something)
- Implement blacklist of untrusted JWT
- Confirm user email address after creating account
- Keep user logged in with refresh tokens
- Implement MFA
- Prevent parameter pollution causing uncaught exceptions (will implement)
  - For example, try to just insert two field parameters into the query string that searches for all tours.
  - our application is not prepared for that.

### Cookies

- a small piece of text that a server can send to clients
- when the client receives a cookie, it will automatically store it
- and then automatically send it back along with all future requests to the same server.
- a browser automatically stores a cookie that it receives and sends it back in all future requests to that server where it came from.
- attach it to the response object

### Rate limiter

- Set up as global middleware
- We can see the rate limit and reset time in the api headers

### Http headers

- `helmet` will introduce extra headers for mroe protection
- `helmet` is a collection of multiple middlewares
- https://github.com/helmetjs/helmet

### Data Sanitisation

- Without sanitisation, passing in a request with this body will return a token,

  ```
  {
      "email": { "$gt": "" },
      "password": "newpass111"
  }
  ```

- Need to filter out all special characters
- `xss-clean` will remove malicious html with js code and convert them to other characters. like these
  ```
  {
      "name": "<div>bad code</div>",
      "email": "ccc@aa.com",
      "password": "ccc@aa.com",
      "passwordConfirm": "ccc@aa.com"
  }
  ```

### Parameter Pollution

- `?sort=duration&sort=price` this will cause an error as server expected `sort` to be string. passing it twice will make it an array.
- `hpp` will use the last parameter if there is duplicate
- `hpp` can whitelist parameters if we really need to pass in more than 1

## Data Modelling

- the process of taking unstructured data generated by a real world scenario and then structure it into a logical data model in a database.
- For example, lets say that we want to designan online shop data model.
  - There will be initially a ton of unstructured data that we know we need.
  - Stuff like products, categories, customer's orders, shopping carts, suppliers. And so on and so forth.
  - Our goal with data modeling is to then structure this data into a logical way.
  - Reflecting the real-world relationships that exists between some of these data sets.

### 4 steps

1. how to identify different types of relationships between data.
1. understand the difference between referencing or normalization and embedding or denormalization.
1. framework for deciding whether we should embed documents or reference to other documents based on a couple of different factors.
1. different types of referencing.

### Types of relationships between data

- 1 to 1
- 1 to many
  - 1 to few (eg 1 movie to few awards)
  - 1 to many (eg 1 movie to hundreds/thousands of reviews)
  - 1 to ton (eg 1 user to millions of log records)
  - most important facotr as it determines if we should denormalise or normalise data
- many to many

### Referencing vs embedding

#### Referenced / Normalised

- keep two related datasets and all the documents separated.
- pros: easier to query each document on its own
- cons: need 2 queries to get data from referenced docs
- child referencing:
  ```
  {
    "_id": ObjectID('222),
    "actors": [
      ObjectID('333'),
      ObjectID('444'),
    ]
  }
  ```

#### Embedded / Denormalised

- no need for separate documents, collections, and IDs
- pros: application will need to fewer queries to the database, better performance
- cons: can't query the embedded data on its own.
  ```
  {
    "_id": ObjectID('222),
    "actors": [
      {
        "name": "Matthew McConaughey",
        "age": 50
      },
      {
        "name": "Anne Hathaway",
        "age": 37
      }
    ]
  }
  ```

### When to embed and when to reference

- In general, always favour embedding

  1. Relationship Type

  - look at the type of relationships that exists between datasets

  1. Data access patterns

  - try to determine the data access pattern of the dataset that we want to either embed or reference.
  - to analyze how often data is read and written in that dataset.

  1. Data closeness

  - how much the data is really related and how we want to query the data from the database.

|                      | Embedding                                           | Referencing                                         |
| -------------------- | --------------------------------------------------- | --------------------------------------------------- |
| Relationship Type    | 1: few, 1: many                                     | 1: many, 1: ton, many: many                         |
| Data access patterns | Data mostly read, does not change quickly, high R/W | Data updated a lot, low R/W ratio                   |
| Data closeness       | Data really belong together                         | Frequently need to query both datasets on their own |

### Types of referencing

1. Child referencing

- store related child ids in an array
- this array of IDs can become very large if there are lots of children.
- this is an anti-pattern in MongoDB, something that we should avoid at all costs.
- child referencing makes it so that parents and children are very tightly coupled. Which is not always ideal.
- best used for 1:few

1. Parent referencing

- in each child document we keep a reference to the parent element.
- child always knows its parent.
- parent actually knows nothing about the children.
- eg, we can use this to reference each log record to the parent user
- array should never be allowed to grow indefinitely.
- best used for 1:many, 1:ton

1. 2-way referencing

- parent keey array of child id, each child keep an array parent id
- many:many
