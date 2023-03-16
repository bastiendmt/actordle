'use client';

import { Result } from '@/types/types';
import { useState } from 'react';

const LIMIT = 6;

export const Game = ({ list, actor }: { list: Result[]; actor: Result }) => {
  const [userInput, setUserInput] = useState('');
  const [filteredList, setFilteredList] = useState(list);

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [userChoice, setUserChoice] = useState<string>();

  // useEffect(() => {
  //   if (userInput !== '') {
  //     const newList = filteredList.filter((actor) =>
  //       actor.name.includes(userInput)
  //     );
  //     setFilteredList(newList);
  //     console.log(userInput);
  //     console.log(newList.length);
  //   }
  // }, [userInput]);

  const submitChoice = () => {
    if (!userChoice) return;
    if (guesses.includes(userChoice)) {
      console.log('already guessed');
      return;
    }
    console.log('picked: ', userChoice);

    addGuess((oldState) => [...oldState, userChoice]);
    if (userChoice === actor.id.toString()) {
      setSuccess(true);
    }
  };

  return (
    <>
      <div>Tries : {guesses.length + 1} / 6</div>
      {/* <input
        type='text'
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></input> */}
      <select onChange={(e) => setUserChoice(e.target.value)}>
        <option value=''></option>
        {filteredList.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name}
          </option>
        ))}
      </select>
      <button type='button' onClick={submitChoice}>
        send result
      </button>
      {success && 'gagné'}
      {guesses.length >= 5 && success && <h2>You win !</h2>}
      {guesses.length >= 5 && !success && <h2>You loose :(</h2>}
    </>
  );
};
