# useReducer

- very similiar to useState
- whenever state changes, component is going to rerender
- very similiar techniques between useReducer and redux
- useful when there are several different closely related pieces of state
- useful when future state values depend on current state

## Implementing

1. comment out all state, getters and setters
1. import useReducer
1. destructure state and dispatch
1. define reducer, state variable and initial state

```
const [  state     ,      dispatch        ] = useReducer(reducer, { count: initialCount, valueToAdd: 0, });
          |                  |                                                          |
      state variable   function to change state                                     initial value
          |                  |                                                          |
         \|/                \|/                                                        \|/

const[  count       ,    setCount         ] = useState(                             initialCount         );
const[  valutToAdd  ,    setValueToAdd    ] = useState(                                 0                );
```

### useState

- each piece of state defined as a separate variable

### useReducer

- all state for whoile component defined in a single state object

## Replacing useState

- change all useState vars with state vars from useReducer, `count` --> `state.count`

## Update state

- start by calling `dispatch` function
- reducer function

  - whatever returned by reducer will be new state
  - if return nothing, state will be undefined
  - **always make sure we return some reasonable value**
  - **no async/await, no requests, no promises, no outside variable**
  - do not modify `state` directly in reducer

    Bad example:

    ```
        const reducer = (state, action) => {
            state.count = state.count +1;
            return state;
        }
    ```

    Good example:

    ```
        const reducer = (state, action) => {
            return {
                ...state, // copy all properties from existing object
                count: state.count +1 // overwrite the property we wanna change
            }
        }
    ```
