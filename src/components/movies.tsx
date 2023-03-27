'use client';

import { Configuration, KnownFor, Result } from '@/types/types';
import Fireworks, { FireworksHandlers } from '@fireworks-js/react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { H2 } from './ui/titles';

const MAX_GUESSES = 6;

export const Movies = ({
  allMovies,
  correctMovies,
  correctActor,
  configuration,
}: {
  allMovies: KnownFor[];
  correctMovies: KnownFor[];
  correctActor: Result;
  configuration: Configuration;
}) => {
  const [userInput, setUserInput] = useState('');
  const [moviesToRender, setMoviesToRender] = useState<KnownFor[]>([]);
  const [correctAnswers, addCorrectAnswers] = useState(0);

  const [guesses, addGuess] = useState<string[]>([]);
  const [userChoice, setUserChoice] = useState<string>();

  const ref = useRef<FireworksHandlers>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const filteredMovies = allMovies.filter(
    (movie) =>
      movie.name?.toLowerCase().includes(userInput) ||
      movie.original_title?.toLowerCase().includes(userInput)
  );

  const handleCorrectPick = (movie: KnownFor) => {
    setMoviesToRender((prev) => [...prev, movie]);
    addCorrectAnswers((prev) => prev + 1);
  };

  const submitChoice = () => {
    if (!userChoice) return;
    if (guesses.includes(userChoice)) {
      console.log('already guessed');
      return;
    }

    addGuess((oldState) => [...oldState, userChoice]);
    correctMovies.forEach((movie) => {
      if (movie.id.toString() === userChoice) {
        handleCorrectPick(movie);
      } else {
        // handle incorrect pick
        // render all movies when loosing
      }
    });

    if (correctAnswers + 1 === correctMovies.length) {
      setShowFireworks(true);
      setTimeout(() => {
        setShowFireworks(false);
      }, 2500);
    }
    // todo, reset userInput and userChoice ?
  };

  useEffect(() => {
    if (guesses.length == MAX_GUESSES) {
      setMoviesToRender(correctMovies);
    }
  }, [guesses]);

  const playedIn = (movies: KnownFor[]) => (
    <div className='flex flex-col'>
      {movies.map((movie) => (
        <div key={movie.id} className='my-1'>
          <div>{movie.original_title || movie.name}</div>
          <Image
            width={180}
            height={100}
            src={`${configuration.images.base_url}/w185/${movie.backdrop_path}`}
            alt={movie.original_title || 'famous movie'}
            className='rounded-md drop-shadow-md'
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <H2>Round 2, guess {correctActor.gender === 1 ? 'her' : 'his'} movies</H2>
      {guesses.length < MAX_GUESSES &&
        correctAnswers < correctMovies.length && (
          <>
            <Input
              placeholder='Filter movies or tv shows'
              onChange={(e) => setUserInput(e.target.value.toLowerCase())}
              className='max-w-[18rem]'
            />
            <ScrollArea className='h-96 w-72 overflow-scroll rounded-md border border-pink-400 dark:border-slate-700'>
              <div className='px-2'>
                <h4 className='my-4 text-sm font-medium leading-none'>
                  Movies
                </h4>
                {filteredMovies.map((movie) => (
                  <div key={movie.id}>
                    <div
                      onClick={() => setUserChoice(movie.id.toString())}
                      className={`
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-pink-200
                    ${userChoice == movie.id.toString() ? 'bg-pink-200' : ''}
                    `}
                    >
                      {movie.name || movie.original_title}
                    </div>
                    <Separator className='my-4' />
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div>
              Tries : {guesses.length + 1} / {MAX_GUESSES}
            </div>
            <div className='flex gap-4'>
              <Button
                variant='subtle'
                onClick={() => {
                  setMoviesToRender((prev) => [
                    ...prev,
                    correctMovies[moviesToRender.length + 1],
                  ]);
                }}
              >
                Skip
              </Button>
              <Button onClick={submitChoice}>Submit</Button>
            </div>
          </>
        )}
      <div>
        You guessed <strong>{correctAnswers}</strong> / {correctMovies.length}
      </div>

      {playedIn(moviesToRender)}

      {showFireworks && (
        <Fireworks
          ref={ref}
          options={{ opacity: 0.5 }}
          style={{
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed',
          }}
        />
      )}
    </>
  );
};
