'use client';

import { Configuration, Result } from '@/types/types';
import { replaceAt } from '@/utils/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { H2, H3 } from './ui/titles';

const LIMIT = 6;

export const Game = ({
  allActors,
  correctActor,
  configuration,
}: {
  allActors: Result[];
  correctActor: Result;
  configuration: Configuration;
}) => {
  const [userInput, setUserInput] = useState('');
  const [filteredList, setFilteredList] = useState(allActors);

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<string>();
  const [end, setEnd] = useState<boolean>(false);
  const [movieHints, setMovieHints] = useState(0);

  const [nameHint, setNameHint] = useState(
    correctActor.name.replace(/[a-zA-Z0-9]/gi, '_')
  );

  useEffect(() => {
    if (userInput === '') {
      setFilteredList(allActors);
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
    if (userChoice === correctActor.id.toString()) {
      endGame(true);
    }
  };

  const endGame = (success: boolean) => {
    setEnd(true);
    setSuccess(success);
    setMovieHints(3);
    setNameHint(correctActor.name);
  };

  // Debug to 2n round
  // useEffect(() => {
  //   endGame(true);
  // }, []);

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
      setNameHint((hidden) =>
        replaceAt(hidden, index, correctActor.name[index])
      );
    }
    if (hint === 4) {
      const lastName = correctActor.name.split(' ')[1];
      const index = correctActor.name.indexOf(lastName);
      setNameHint((hidden) =>
        replaceAt(hidden, index, correctActor.name[index])
      );
    }
  };

  const getHint = () => {
    if (guesses.length > LIMIT) return;
    addGuess((oldState) => [...oldState, '']);
    showHint(guesses.length);
  };

  const mostKnownFor = () => {
    // TODO to memorize
    const playedIn = correctActor.known_for.map((knownFor) => {
      // console.log('most known rendered');
      return (
        <div key={knownFor.id} className='my-1'>
          <div>{knownFor.original_title}</div>
          <Image
            width={180}
            height={100}
            src={`${configuration.images.base_url}/w185/${knownFor.backdrop_path}`}
            alt={knownFor.original_title || 'famous movie'}
            className='rounded-md drop-shadow-md'
          />
        </div>
      );
    });
    return (
      <div>
        <H3>Most known for</H3>
        {playedIn.slice(0, movieHints)}
      </div>
    );
  };

  return (
    <>
      <H2>{nameHint}</H2>
      {!end && (
        <>
          <Input
            placeholder='Filter actors'
            onChange={(e) => setUserInput(e.target.value.toLowerCase())}
            className='max-w-[18rem]'
          />
          <ScrollArea className='h-96 w-72 overflow-scroll rounded-md border border-teal-400 dark:border-slate-700'>
            <div className='px-2'>
              <h4 className='my-4 text-sm font-medium leading-none'>Actors</h4>
              {filteredList.map((actor) => (
                <div key={actor.id}>
                  <div
                    onClick={() => setUserChoice(actor.id.toString())}
                    className={`
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-teal-200
                    ${userChoice == actor.id.toString() ? 'bg-teal-200' : ''}
                    `}
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
      {!end && (
        <div className='flex gap-4'>
          <Button variant='subtle' onClick={getHint}>
            Get a hint
          </Button>
          <Button onClick={submitChoice}>Submit</Button>
        </div>
      )}
      {guesses.length > 0 && mostKnownFor()}
      {success && <H3 classes='text-green-600'>You won !</H3>}
      {end && !success && (
        <>
          <H3 classes='text-red-600'>You lost :(</H3>
          <div>Maybe you will have more luck tomorrow</div>
        </>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className='flex flex-col rounded-md bg-zinc-200 p-2 align-middle'>
          <i>_debug section</i>
          <strong>actor: {correctActor.name}</strong>
          <div>
            {correctActor.known_for.map((movie) => (
              <p key={movie.id}>{movie.original_name}</p>
            ))}
          </div>
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
