import { useEffect, useRef, useState } from 'react'


function App() {
  const [name, setName] = useState('');

  // should not use useState+useEfect to count no of times rendered because it will throw react in infinite loop
  // as useState trigger component update, which triger useEffect, which trigger useState and so on
  const renderCount = useRef<number>(1);
  // useRef is always an ohject with a current property, which will take whatever value we pass into useRef
  // current property is what gets persisted between different renders

  // useRef to reference elements inside html (works exactly like document query selector)
  const inputRef = useRef<HTMLInputElement | null>(null);
  function focus() {
    inputRef.current?.focus();
  }

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  // store previous state value
  const prevName = useRef('');
  useEffect(() => {
    prevName.current = name;
  }, [name]);

  return (
    <>
      <input ref={inputRef} value={name} onChange={e => setName(e.target.value)} />
      <div>Name: {name}</div>
      <div>prevName: {prevName.current}</div>

      {/* every time the component is rerendered, this value persisted and is counting up */}
      <div>Render Count: {renderCount.current}</div>

      <button onClick={focus}>Focus</button>
    </>
  )
}

export default App
