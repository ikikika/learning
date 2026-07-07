"use client"

import { useState } from "react";



const Item = ({ label }: { label: string }) => {
  const [txt, setTxt] = useState("");
  return (
    <div>
      {label}
      <input value={txt} onChange={e => setTxt(e.target.value)} />
    </div>
  );
};

const App = () => {
  const [filter, setFilter] = useState("");

  const items = [
    { id: 1, label: "A" },
    { id: 2, label: "B" },
    { id: 3, label: "C" }
  ];

  const filtered = items.filter(i =>
    i.label.includes(filter)
  );

  return (
    <>
      <input onChange={e => setFilter(e.target.value)} />
      {filtered.map((item, idx) => (
        <Item key={idx} label={item.label} />
      ))}
    </>
  );
};



export default App;