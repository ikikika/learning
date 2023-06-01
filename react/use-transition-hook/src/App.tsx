import { useState, useTransition } from 'react'

import './App.css'

const listSize = 20000;

function App() {
  const [name, setName] = useState("")
  const [list, setList] = useState<string[]>([])

  // The useTransition hook allows us to specify some state updates as not as important.
  // state updates will be executed in parallel with other state updates, 
  // but the rendering of the component will not wait for these less important state updates.
  const [isPending, startTransition] = useTransition()

  function handleChange(e: { target: { value: string; }; }) {
    // sets name and large list at the same time
    // very slow and takes time to update both name and large list

    // input updates immediately when you type, but the actual list itself does not update until later
    setName(e.target.value)

    startTransition(() => {
      const l: string[] = [];
      for (let i = 0; i < listSize; i++) {
        l.push(e.target.value);
      }
      setList(l)
    });
  }

  return (
    <>
      <input type="text" value={name} onChange={handleChange} />
      {isPending
        ? <div>loading...</div>
        : list.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
    </>
  )

}

export default App

// this is not something you want to use all the time. 
// should only use this hook if you are having performance issues with your code and there are no other ways to fix those performance concerns. 
// If you use this hook all the time you will actually make your app less performant since React will not be able to effectively group your state updates 
// it will also add extra overhead to your application.