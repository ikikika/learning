import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("");

  function handleChange(e: { target: { value: string; }; }) {
    setInput(e.target.value)
  }

  useEffect(() => {
    setOutput(input);
  }, [input]);

  return (
    <>
      <input type="text" value={input} onChange={handleChange} />
      <br/>
      input: {input} 
      <br/>
      output: {output}
    </>
  )
}


export default App
