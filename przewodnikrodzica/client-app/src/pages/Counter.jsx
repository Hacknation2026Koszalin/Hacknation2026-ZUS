// src/pages/Counter.jsx
import { useState } from 'react';

export default function Counter() {
  const [currentCount, setCurrentCount] = useState(0);

  return (
    <>
      <h1>Counter</h1>
      <p role="status">Current count: {currentCount}</p>
      <button className="btn btn-primary" onClick={() => setCurrentCount(c => c + 1)}>
        Click me
      </button>
    </>
  );
}