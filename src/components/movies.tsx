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
      setEnd(true);
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

  const submitChoice = (choice?: string) => {
    setShowList(false);
    if (!choice) {
      addGuess((oldState) => [...oldState, '']);
      return;
    }
    if (guesses.includes(choice)) {
      console.log('already guessed');
      return;
    }

    addGuess((oldState) => [...oldState, choice]);

    let allIncorrect = true;
    correctMovies.forEach((movie) => {
      if (movie.id.toString() === choice) {
        allIncorrect = false;
        handleCorrectPick(movie);
        return;
      }
    });
    allIncorrect && showWrongGuess();
    setUserInput('');
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

  /** Return variant of blurred depending of the guesses length or an animation if the movie is guessed */
  const getBlurredClass = (blurred: boolean) => {
    if (!blurred) return 'animate-scale';
    const classes = ['blur-lg', 'blur-md', 'blur', 'blur-sm', 'blur-none'];
    const index = Math.min(guesses.length, classes.length);
    return classes[index];
  };

  const playedIn = (movies: RenderMovie) => (
    <div className='flex max-w-[180px] flex-col'>
      {movies.map(({ movie, blurred }) => (
        <div key={movie.id} className='my-2'>
          {blurred ? (
            <div className='flex justify-between text-gray-500'>
              <span>-----</span>
              <span>{movie.release_date?.toString().substring(0, 4)}</span>
            </div>
          ) : (
            movie.title || movie.name
          )}
          <Image
            width={180}
            height={100}
            src={`${configuration.images.base_url}/w185/${movie.backdrop_path}`}
            alt={
              blurred
                ? 'movie to guess'
                : movie.title || movie.name || 'famous movie'
            }
            className={`rounded-md drop-shadow-md ${getBlurredClass(blurred)}`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className='flex flex-col items-center animate-in zoom-in duration-300'>
      <H2>
        Round 2, guess {correctActor.gender === 1 ? 'her' : 'his'} movies and tv
        shows
      </H2>
      {!end && (
        <>
          <div>
            Tries : {guesses.length + 1} / {MAX_GUESSES}
          </div>
          <div className='relative flex w-full max-w-xs '>
            <div className='flex flex-1'>
              <Input
                placeholder='Filter movies or tv shows'
                className='rounded-r-none bg-zinc-50 text-base'
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onFocus={() => {
                  setShowList(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowList(false);
                  }, 200);
                }}
              />
              {showList && (
                <ScrollArea
                  className='!absolute bottom-12
               z-40 max-h-80 w-full max-w-xs overflow-scroll overflow-x-hidden rounded-md border border-pink-400 bg-zinc-50 drop-shadow-2xl dark:border-slate-700'
                >
                  <div className='px-3'>
                    <h4 className='my-4 text-sm leading-none text-gray-500'>
                      Movies
                    </h4>
                    {filteredMovies.map((movie) => (
                      <div key={movie.id}>
                        <div
                          onClick={() => submitChoice(movie.id.toString())}
                          onKeyDown={(event) =>
                            event.key === 'Enter' &&
                            submitChoice(movie.id.toString())
                          }
                          tabIndex={0}
                          className='
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-pink-200
                    '
                        >
                          {movie.title || movie.name}
                        </div>
                        <Separator className='my-2' />
                      </div>
                    ))}
                    {filteredMovies.length === 0 && (
                      <div className='p-2'>No movies found</div>
                    )}
                  </div>
                </ScrollArea>
              )}
              <Button onClick={() => submitChoice()} className='rounded-l-none'>
                Skip
              </Button>
            </div>
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
        <Button
          className='mt-4 bg-amber-400 text-black hover:bg-amber-500'
          onClick={() =>
            window.open(`https://www.imdb.com/name/${actorDetails.imdb_id}/`)
          }
        >
          Find more on IMBd
        </Button>
      )}
    </div>
  );
};
