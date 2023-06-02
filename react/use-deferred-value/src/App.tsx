import { useDeferredValue, useEffect, useState } from 'react'
import './App.css'

function App() {

  // sometimes we want some delay after setting input before we get output
  // eg, inputting search term to trigger filtering api from BE
  // not efficient if api is called on every keystroke
  const [input, setInput] = useState("")
  
  // useDeferredValue hook implements a delay before some information is calculated. 
  // This works in a very similar way to debouncing and throttling since our deferred value will only be calculated after the important state updates have finished running. 
  const deferredInput = useDeferredValue(input);

  function handleChange(e: { target: { value: string; }; }) {
    setInput(e.target.value)
  }

  useEffect(() => {
    console.log({input, deferredInput});
  }, [input, deferredInput]);

  return (
    <>
      <input type="text" value={input} onChange={handleChange} />
      <br/>
      input: {input} 
      <br/>
      output: {deferredInput}
    </>
  )
}

export default App
