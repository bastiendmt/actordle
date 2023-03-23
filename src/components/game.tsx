'use client';

import { Configuration, Result } from '@/types/types';
import { replaceAt } from '@/utils/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/seprator';

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
      endGame(true);
    }
  };

  const endGame = (success: boolean) => {
    setEnd(true);
    setSuccess(success);
    setMovieHints(3);
    setNameHint(actor.name);
  };

  useEffect(() => {
    if (guesses.length >= LIMIT) {
      setEnd(true);
    }
    showHint(guesses.length);
  }, [guesses]);

  const showHint = (hint: number) => {
    if (hint === 1) {
      setMovieHints(1);
    }
    if (hint === 2) {
      setMovieHints(2);
    }
    if (hint === 3) {
      const index = 0;
      setNameHint((hidden) => replaceAt(hidden, index, actor.name[index]));
    }
    if (hint === 4) {
      const lastName = actor.name.split(' ')[1];
      const index = actor.name.indexOf(lastName);
      setNameHint((hidden) => replaceAt(hidden, index, actor.name[index]));
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
      <div>{nameHint}</div>
      {mostKnownFor()}
      {!end && (
        <>
          <Input onChange={(e) => setUserInput(e.target.value.toLowerCase())} />
          <ScrollArea className='h-96 w-72 overflow-scroll rounded-md border border-teal-400 dark:border-slate-700'>
            <div className='p-4'>
              {filteredList.map((actor) => (
                <div key={actor.id}>
                  <div
                    onClick={() => setUserChoice(actor.id.toString())}
                    className={`
                    cursor-pointer
                    ${userChoice == actor.id.toString() ? 'bg-teal-500' : ''}`}
                  >
                    {actor.name}
                  </div>
                  <Separator className='my-4' />
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
      <div>Tries : {guesses.length + 1} / 6</div>
      <div className='flex gap-4'>
        <Button variant='subtle' onClick={getHint}>
          Get a hint
        </Button>
        <Button onClick={submitChoice}>Submit</Button>
      </div>
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

      {process.env.NODE_ENV === 'development' && (
        <div className='flex flex-col rounded-md bg-zinc-200 p-2 align-middle'>
          <i>_debug section</i>
          <strong>actor: {actor.name}</strong>
          <div className='flex justify-center gap-2 p-2'>
            <Button className='bg-emerald-400' onClick={() => endGame(true)}>
              WIN
            </Button>
            <Button className='bg-red-400' onClick={() => endGame(false)}>
              LOOSE
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
