import React, { useState, useEffect } from "react";
import axios from "axios";

const Counter = () => {
  const [count, setCount] = useState(0);

  const fetchCounter = async () => {
    try {
      const res = await axios.get("http://localhost:8000/counter");
      setCount(res.data.value);
    } catch (err) {
      console.error(err);
    }
  };

  const incrementCounter = async () => {
    try {
      const res = await axios.post("http://localhost:8000/counter/increment");
      setCount(res.data.value);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCounter();
  }, []);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={incrementCounter}>Increment</button>
    </div>
  );
};

export default Counter;
