'use client';

import { Result } from '@/types/types';
import { useEffect, useState } from 'react';

const LIMIT = 6;

export const Game = ({ list, actor }: { list: Result[]; actor: Result }) => {
  const [userInput, setUserInput] = useState('');
  const [filteredList, setFilteredList] = useState(list);

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<string>();
  const [end, setEnd] = useState<boolean>(false);

  useEffect(() => {
    if (userInput === '') {
      setFilteredList(list);
      return;
    }

    const newList = filteredList.filter((actor) =>
      actor.name.toLowerCase().includes(userInput)
    );
    setFilteredList(newList);
  }, [userInput]);

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
      setEnd(true);
    }
  };

  useEffect(() => {
    if (guesses.length >= 5) {
      setEnd(true);
    }
  }, [guesses]);

  return (
    <>
      <div>Tries : {guesses.length + 1} / 6</div>
      {!end && (
        <>
          <input
            type='text'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toLowerCase())}
          />
          <div className='listContainer'>
            {filteredList.map((actor) => (
              <div
                key={actor.id}
                onClick={() => setUserChoice(actor.id.toString())}
                className={userChoice == actor.id.toString() ? 'active' : ''}
                style={
                  userChoice == actor.id.toString()
                    ? { backgroundColor: 'teal' }
                    : {}
                }
              >
                {actor.name}
              </div>
            ))}
          </div>
        </>
      )}
      <button type='button' onClick={submitChoice}>
        Submit
      </button>
      {process.env.NODE_ENV === 'development' && (
        <>
          <strong>actor: {actor.name}</strong>
          <i>_dev buttons_</i>
          <button
            onClick={() => {
              setSuccess(true);
              setEnd(true);
            }}
          >
            WIN
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setEnd(true);
            }}
          >
            LOOSE
          </button>
        </>
      )}
      {success && <h2>You win !</h2>}
      {end && !success && (
        <>
          <h2>You loose :(</h2>
          <div>
            Actor of the day is:
            <h3>{actor.name}</h3>
          </div>
        </>
      )}
    </>
  );
};