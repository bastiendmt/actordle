'use client';

import { useState } from 'react';

const Game = () => {
  const [userInput, setUserInput] = useState('');
  return (
    <input
      type='text'
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
    ></input>
  );
};
