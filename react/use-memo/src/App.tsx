import { useState, useMemo, useEffect } from 'react'

function slowFunction(num: number) {
  console.log('calling slow function');
  for (let i = 0; i < 100000000; i++) { } // simulate slow function
  return num * 2;
}

function App() {
  const [number, setNumber] = useState(0);
  const [dark, setDark] = useState(false);

  // this function is very slow 
  // will be called whenever theres a change in state and the component needs to rerender
  // results does not change that often

  // this function will always give us the same output everytime we give it the same input
  // useMemo cache input value and output it give us
  // so we dun have to recompute it every single time
  // react will only rerun the code inside useMemo if number changes
  const doubleNumber = useMemo(() => {
    return slowFunction(number);
  }, [number]) 

  const themeStyles = {
    backgroundColor: dark ? 'black' : 'white',
    color: dark ? 'white' : 'black'
  }

  useEffect(() => {
    console.log('theme changed');
    // this useEffect will be triggered everytime we rerender the function 
    // because every time the function is run, a new themeStyles object is created, even though it might have the same value as the last run
    // different reference in the memory
  }, [themeStyles]);

  return (
    <>
      <input type="number" value={number} onChange={e => setNumber(parseInt(e.target.value))} />
      <button onClick={() => setDark(prevDark => !prevDark)}>Change theme</button>

      {/* take a long time to output this because of slow function */}
      <div style={themeStyles}>{doubleNumber}</div>
    </>
  )
}

export default App

// useMemo does have performance overhead and memory overhead
// only use useMemo when the function u r calling is incredibly slow