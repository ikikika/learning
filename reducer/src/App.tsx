import React, { ChangeEvent, FormEvent, useReducer } from "react";
import "./App.css";

interface StateType {
  count: number;
  valueToAdd: string;
}

const reducer = (state: StateType, action: any) => {};

function App() {
  // these 2 pieces of state are very closely related, as they are used together in handleSubmit
  // in increment/decrement, we update state by changing the current value. this is an example of future value of state depending on current value
  // const [count, setCount] = useState(0);
  // const [valueToAdd, setValueToAdd] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  });
  console.log(state);

  const increment = () => {
    // setCount(count + 1);
  };
  const decrement = () => {
    // setCount(count - 1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // setValueToAdd(+event.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // setCount(count + valueToAdd);
    // setValueToAdd(0);
  };

  return (
    <div className="App">
      <h1 className="text-lg">Count is {state.count}</h1>
      <div className="flex flex-row">
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Add a lot!</label>
        <input
          type="number"
          value={state.valueToAdd || ""}
          onChange={handleChange}
        />
        <button>Add it!</button>
      </form>
    </div>
  );
}

export default App;
