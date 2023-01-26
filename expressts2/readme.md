## Issue with Type Definition Files

- can't accurately express whats going on in the JS world. 
    - eg, middleware
    - middleware can add on or remove properties 
    - TS is unable to determine
- provided files arent always accurate
- inputs to server (or any program with external inputs) are not guaranteed to exist or be of the correct type
    - eg in body-parser, 
    - `body` object is type `any`, but it may not exist and we dun want to use type `any`

- Addressing these issues with TS force us to write better code

## Decorators Implementation
1. Associate with route
2. Do some validation
3. Set up some middleware
4. Mark a class as a controller

### Why is this hard?
- Getting decorators to work together.
```
@post('/login')
@use(validateAuth)

function post(route: string){
    return function(target: any, key: string, desc: PropertyDescriptor){
        router.post(...);
    }
}

function use(middleware: any){
    return function(target: any, key: string, desc: PropertyDescriptor){
        // problem lies here
        // need to communicate some info from this function back to the router statement in the post function
        // difficult to inject middleware back into the post function
        // one solution: find the last handler we just registered, usebackwards inject with a custom function. not a good solution.
        // router.addMiddlwareToHandlerWeJustRegistered(middleware);
    }
}

```

### Better Solution
1. Node executes our code
2. Class definition read in - decorators are execucted
3. Decorators associate route configuration info with method by using metadata
4. All method decorators run
5. Class decorator of @controller runs last
6. Class decorator reads metadata from each method, adds complete route definitions to router

#### What is Metadata?
- Proposed feature to be added to JS
- Snippets of info that can be tied to a method, property or class definition
- Can be used for super custom stuff
- TS will (optionally) provide type info as metadata
- Read and written using the reflect-metadata package