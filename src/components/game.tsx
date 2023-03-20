'use client';

import { Configuration, Result } from '@/types/types';
import { replaceAt } from '@/utils/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const LIMIT = 6;

export const Game = ({
  list,
  actor,
  configuration,
}: {
  list: Result[];
  actor: Result;
  configuration: Configuration;
}) => {
  const [userInput, setUserInput] = useState('');
  const [filteredList, setFilteredList] = useState(list);

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<string>();
  const [end, setEnd] = useState<boolean>(false);
  const [movieHints, setMovieHints] = useState(0);

  const [nameHint, setNameHint] = useState(
    actor.name.replace(/[a-zA-Z0-9]/gi, '_')
  );

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
    showHint(guesses.length);
  }, [guesses]);

  const showHint = (hint: number) => {
    if (hint === 1) {
      const index = 0;
      setNameHint((hidden) => replaceAt(hidden, index, actor.name[index]));
    }
    if (hint === 2) {
      const lastName = actor.name.split(' ')[1];
      const index = actor.name.indexOf(lastName);
      setNameHint((hidden) => replaceAt(hidden, index, actor.name[index]));
    }
    if (hint === 3) {
      setMovieHints(1);
    }
    if (hint === 4) {
      setMovieHints(2);
    }
  };

  const getHint = () => {
    addGuess((oldState) => [...oldState, '']);
    showHint(guesses.length);
  };

  const mostKnownFor = () => {
    // TODO to memorize
    const playedIn = actor.known_for.map((knownFor) => (
      <div key={knownFor.id}>
        <div>{knownFor.original_title}</div>
        <Image
          width={180}
          height={100}
          src={`${configuration.images.base_url}/w185/${knownFor.backdrop_path}`}
          alt={knownFor.original_title || 'famous movie'}
        />
      </div>
    ));
    return (
      <div>
        <h3>Most known for</h3>
        {playedIn.slice(0, movieHints)}
      </div>
    );
  };

  return (
    <>
      {mostKnownFor()}
      <div>{nameHint}</div>
      <div>Tries : {guesses.length + 1} / 6</div>
      {!end && (
        <>
          <input
            type='text'
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
      <button type='button' onClick={getHint}>
        Get a hint
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
