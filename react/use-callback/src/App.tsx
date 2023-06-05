import { useEffect, useState } from 'react'

function List({ getItems }: {getItems: () => number[]}) {
  const [items, setItems] = useState<number[]>([]);

  useEffect( () => {
    setItems(getItems());
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

  const getItems = () => {
    // simulate a funciton taht calls an api
    return [number, number + 1, number + 2];
  }

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
