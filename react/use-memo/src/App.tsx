import { useState } from 'react'

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
  const doubleNumber = slowFunction(number); 

  const themeStyles = {
    backgroundColor: dark ? 'black' : 'white',
    color: dark ? 'white' : 'black'
  }

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
