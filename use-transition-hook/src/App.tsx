import { useState } from 'react'

import './App.css'

const listSize = 20000;

function App() {
  const [name, setName] = useState("")
  const [list, setList] = useState<string[]>([])

  function handleChange(e: { target: { value: string; }; }) {
    setName(e.target.value)

    const l: string[] = [];
    for (let i = 0; i < listSize; i++) {
      l.push(e.target.value);
    }

    setList(l)
  }

  return (
    <>
      <input type="text" value={name} onChange={handleChange} />
      {list.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </>
  )

}

export default App
