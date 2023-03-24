'use client';

import { KnownFor } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Separator } from '@radix-ui/react-separator';
import { useState } from 'react';
import { Input } from './ui/input';

export const Movies = ({ allMovies }: { allMovies: KnownFor[] }) => {
  const [userInput, setUserInput] = useState('');

  allMovies.forEach((movie) => {
    console.log(movie.original_title);
  });

  return (
    <div>
      <h2>Movies</h2>
      <Input
        placeholder='Filter'
        onChange={(e) => setUserInput(e.target.value.toLowerCase())}
        className='max-w-[18rem]'
      />
      <ScrollArea className='h-96 w-72 overflow-scroll rounded-md border border-teal-400 dark:border-slate-700'>
        <div className='px-2'>
          <h4 className='my-4 text-sm font-medium leading-none'>Movies</h4>
          {allMovies.map((movie) => (
            <div key={movie.id}>
              <div
                // onClick={() => setUserChoice(actor.id.toString())}
                className={`
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-teal-200
                    
                    `}
              >
                {movie.name || movie.original_title}
              </div>
              <Separator className='my-4' />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
