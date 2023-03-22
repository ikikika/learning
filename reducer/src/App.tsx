import React, { ChangeEvent, FormEvent, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [valueToAdd, setValueToAdd] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };
  const decrement = () => {
    setCount(count - 1);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValueToAdd(+event.target.value);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCount(count + valueToAdd);
    setValueToAdd(0);
  };

  return (
    <div className="App">
      <h1 className="text-lg">Count is {count}</h1>
      <div className="flex flex-row">
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Add a lot!</label>
        <input type="number" value={valueToAdd || ""} onChange={handleChange} />
        <button>Add it!</button>
      </form>
    </div>
  );
}

export default App;
