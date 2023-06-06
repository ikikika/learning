import { useEffect, useRef, useState } from 'react'


function App() {
  const [name, setName] = useState('');

  // should not use useState+useEfect to count no of times rendered because it will throw react in infinite loop
  // as useState trigger component update, which triger useEffect, which trigger useState and so on
  const renderCount = useRef<number>(1);
  // useRef is always an ohject with a current property, which will take whatever value we pass into useRef
  // current property is what gets persisted between different renders

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <div>Name: {name}</div>

      {/* every time the component is rerendered, this value persisted and is counting up */}
      <div>Render Count: {renderCount.current}</div>
    </>
  )
}

export default App
