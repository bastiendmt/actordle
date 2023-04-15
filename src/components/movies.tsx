import { useConfetti } from '@/hooks/useConfetti';
import { useWrongGuess } from '@/hooks/useWrongGuess';
import { Actor, Configuration, KnownFor, Result } from '@/types/types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Separator } from '@radix-ui/react-separator';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { H2 } from './ui/titles';

const MAX_GUESSES = 6;

type RenderMovie = { blurred: boolean; movie: KnownFor }[];

export const Movies = ({
  allMovies,
  correctMovies,
  correctActor,
  configuration,
  actorDetails,
}: {
  allMovies: KnownFor[];
  correctMovies: KnownFor[];
  correctActor: Result;
  configuration: Configuration;
  actorDetails: Actor;
}) => {
  const [userInput, setUserInput] = useState('');
  const [moviesToRender, setMoviesToRender] = useState<RenderMovie>(
    correctMovies.map((movie) => ({
      blurred: true,
      movie: movie,
    }))
  );
  const [correctAnswers, addCorrectAnswers] = useState(0);
  const [end, setEnd] = useState(false);

  const [guesses, addGuess] = useState<string[]>([]);
  const [userChoice, setUserChoice] = useState<string>();
  const [showList, setShowList] = useState(false);

  const throwConfetti = useConfetti();
  const [wrongGuess, showWrongGuess] = useWrongGuess();

  const filteredMovies = allMovies.filter(
    (movie) =>
      movie.name?.toLowerCase().includes(userInput.toLowerCase()) ||
      movie.title?.toLowerCase().includes(userInput.toLowerCase())
  );

  const handleCorrectPick = (movie: KnownFor) => {
    // unBlur correct movie
    setMoviesToRender((prev) =>
      prev.map((correct) => {
        if (correct.movie.id === movie.id) {
          return { ...correct, blurred: false };
        } else {
          return { ...correct };
        }
      })
    );

    const value = correctAnswers + 1;
    addCorrectAnswers(value);
    if (value === correctMovies.length) {
      throwConfetti();
    }
  };

  const handleSkip = () => {
    addGuess((oldState) => [...oldState, '']);

    // filter movies already rendered
    const moviesToAdd = correctMovies.filter(
      (correctMovie) =>
        !moviesToRender.some(({ movie }) => movie.id === correctMovie.id)
    );

    setMoviesToRender((prev) => [
      ...prev,
      { movie: moviesToAdd[0], blurred: false },
    ]);
  };

  const submitChoice = () => {
    if (!userChoice) {
      addGuess((oldState) => [...oldState, '']);
      return;
    }
    if (guesses.includes(userChoice)) {
      console.log('already guessed');
      return;
    }

    addGuess((oldState) => [...oldState, userChoice]);

    let allIncorrect = true;
    correctMovies.forEach((movie) => {
      if (movie.id.toString() === userChoice) {
        allIncorrect = false;
        handleCorrectPick(movie);
        return;
      }
    });
    allIncorrect && showWrongGuess();
    setUserInput('');
    setUserChoice(undefined);
  };

  /**
   * Handle game ending
   */
  useEffect(() => {
    if (guesses.length == MAX_GUESSES) {
      const unBlurred = correctMovies.map((movie) => ({
        blurred: false,
        movie: movie,
      }));
      setMoviesToRender(unBlurred);
      setEnd(true);
    }
  }, [guesses]);

  const playedIn = (movies: RenderMovie) => (
    <div className='flex flex-col'>
      {movies.map(({ movie, blurred }) => (
        <div key={movie.id} className='my-1'>
          <div>{blurred ? '-----' : movie.title || movie.name}</div>
          <Image
            width={180}
            height={100}
            src={`${configuration.images.base_url}/w185/${movie.backdrop_path}`}
            alt={movie.title || movie.name || 'famous movie'}
            className={`rounded-md drop-shadow-md ${blurred ? 'blur-sm' : ''}`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <H2>Round 2, guess {correctActor.gender === 1 ? 'her' : 'his'} movies</H2>
      <div>
        Tries : {guesses.length + 1} / {MAX_GUESSES}
      </div>
      {!end && (
        <>
          <div className='relative flex w-full max-w-xs '>
            <div className='flex flex-1'>
              <Input
                className='rounded-r-none bg-zinc-50'
                placeholder='Filter movies or tv shows'
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                onFocus={() => {
                  setShowList(true);
                }}
              />
              <Button onClick={submitChoice} className='rounded-l-none'>
                Submit
              </Button>
            </div>
            {showList && (
              <ScrollArea
                className='!absolute bottom-12
               z-40 h-80 w-full max-w-xs overflow-scroll overflow-x-hidden rounded-md border border-pink-400 bg-zinc-50 drop-shadow-2xl dark:border-slate-700'
              >
                <div className='px-3'>
                  <h4 className='my-4 text-sm leading-none text-gray-500'>
                    Movies
                  </h4>
                  {filteredMovies.map((movie) => (
                    <div key={movie.id}>
                      <div
                        onClick={() => {
                          setUserChoice(movie.id.toString());
                          setUserInput(movie.title || movie.name || '');
                          setShowList(false);
                        }}
                        className={`
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-pink-200
                    ${userChoice == movie.id.toString() ? 'bg-pink-200' : ''}
                    `}
                      >
                        {movie.title || movie.name}
                      </div>
                      <Separator className='my-2' />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {wrongGuess}

          {/* <div className='flex gap-4'>
            <Button variant='subtle' onClick={handleSkip}>
              Skip
            </Button>
          </div> */}
        </>
      )}
      <div>
        You guessed <strong>{correctAnswers}</strong> / {correctMovies.length}
      </div>

      {playedIn(moviesToRender)}

      {end && (
        <a
          className='underline'
          href={`https://www.imdb.com/name/${actorDetails.imdb_id}/`}
          target='_blank'
        >
          Find more on imdb
        </a>
      )}
    </>
  );
};
