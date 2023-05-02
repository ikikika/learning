## What

- A generic type is a type which is kind of connected with some other type and is really flexible regarding which exact type that other type is.
- eg, Array, inside array can contain other types
  - If TS knows that the array hold strings, TS can then allow us to perform string methods
- Another eg, promises

## Creating generic function

- enclosed in angle brackets
- pass extra information to TS so that TS can better infer the result type
- use keyof constraint to guarantee that 2nd type exist as a property of the 1st type

## Generic Utility Types

- Partial: changes this to a type where all the properties are optional, but eventually will take the properties of the expected type
- Readonly: not allowed to change, add or remove properties to array or object
- https://www.typescriptlang.org/docs/handbook/utility-types.html
