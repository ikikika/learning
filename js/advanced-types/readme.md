## Intersection types

- allow us to combine other types

## Type guards

- helps us with union types
- used to check if certain property or method exists before trying to use it
- approaches: use if statements with
  - typeof (other types)
  - in (objects)
  - instanceof (objects)

## Discriminated Union

- a pattern that makes implementing type guards easier

## Type casting

- tell TypeScript that some value is of a specific type where TypeScript is not able to detect it on it's own, but the dev knows

## Index properties

- define interface such that we dun need to know in advance which property names to use and how many properties we need

## Function overloads

- define multiple function signatures
- we can have multiple possible ways of calling function with different parameters to do something inside the function

## Optional chaining

- not certain if an object with a certain property is defined
- helps us safely access nested properties and nested objects in our object data
- if the thing in front of the question mark is undefined it will not access the thing thereafter
- will not throw a runtime error but instead it will just not continue.

## Nullish Coalescing

- if value is null or undefined, use the fallback value
