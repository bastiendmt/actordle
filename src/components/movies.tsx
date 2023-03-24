'use client';

import { KnownFor } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Separator } from '@radix-ui/react-separator';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const Movies = ({
  allMovies,
  correctMovies,
}: {
  allMovies: KnownFor[];
  correctMovies: KnownFor[];
}) => {
  const [userInput, setUserInput] = useState('');

  const filteredMovies = allMovies.filter(
    (movie) =>
      movie.name?.toLowerCase().includes(userInput) ||
      movie.original_title?.toLowerCase().includes(userInput)
  );

  const [guesses, addGuess] = useState<string[]>([]);
  const [userChoice, setUserChoice] = useState<string>();
  const submitChoice = () => {
    if (!userChoice) return;
    if (guesses.includes(userChoice)) {
      console.log('already guessed');
      return;
    }
    console.log('picked: ', userChoice);

    addGuess((oldState) => [...oldState, userChoice]);
    correctMovies.forEach((movie) => {
      if (movie.id.toString() === userChoice) {
        console.log('correct movie');
      }
    });
  };

  return (
    <>
      <h2>Round 2, guess his movies</h2>
      <Input
        placeholder='Filter movies'
        onChange={(e) => setUserInput(e.target.value.toLowerCase())}
        className='max-w-[18rem]'
      />
      <ScrollArea className='h-96 w-72 overflow-scroll rounded-md border border-pink-400 dark:border-slate-700'>
        <div className='px-2'>
          <h4 className='my-4 text-sm font-medium leading-none'>Movies</h4>
          {filteredMovies.map((movie) => (
            <div key={movie.id}>
              <div
                // onClick={() => setUserChoice(actor.id.toString())}
                className={`
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-pink-200
                    
                    `}
              >
                {movie.name || movie.original_title}
              </div>
              <Separator className='my-4' />
            </div>
          ))}
        </div>
      </ScrollArea>
      {!false && (
        <div className='flex gap-4'>
          <Button variant='subtle'>Get a hint</Button>
          <Button onClick={submitChoice}>Submit</Button>
        </div>
      )}
    </>
  );
};
