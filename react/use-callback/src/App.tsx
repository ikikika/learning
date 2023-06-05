import { useCallback, useEffect, useState } from 'react'

function List({ getItems }: { getItems: (arg: number) => number[] }) {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    setItems(getItems(5));
    // problem: we only want this console log when number is updated
    // however, because App is rerendered no matter if the state number or dark changes
    // getItems is always recreated and will always be different on every rerender
    console.log('updating items');
  }, [getItems]);

  return items.map(item => <div key={item}>{item}</div>);
}

function App() {
  const [number, setNumber] = useState(1);
  const [dark, setDark] = useState(false);

  // useCallback only recreates the function when the number changes
  // not going to recreate function when dark varialble changes
  // we can pass in arguments and let it do function things
  // if this function is really really slow, we can useCallback to only recreate the function when we need to
  const getItems = useCallback((arg: number) => {
    // simulate a funciton taht calls an api
    return [number, number + arg, number + arg + 2];
  }, [number]);

  const theme = {
    backgroundColor: dark ? '#333' : '#fff',
    color: dark ? '#fff' : '#333'
  }

  return (
    <div style={theme}>
      <input
        type="number"
        value={number}
        onChange={e => setNumber(parseInt(e.target.value))}
      />
      <button onClick={() => setDark(prev => !prev)}>
        Toggle theme
      </button>
      <List getItems={getItems} />
    </div>
  )
}

export default App
