import { useConfetti } from '@/hooks/useConfetti';
import { useWrongGuess } from '@/hooks/useWrongGuess';
import { Actor, Configuration, KnownFor, Result } from '@/types/types';
import { buildShareText } from '@/utils/buildShareText';
import { MAX_MOVIE_GUESSES } from '@/utils/constant';
import { cn } from '@/utils/utils';
import { ChevronsUpDown, CircleX } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ShareResults } from './shareResults';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { H2 } from './ui/titles';
import { useToast } from './ui/use-toast';

type RenderMovie = { blurred: boolean; movie: KnownFor }[];

export const Movies = ({
  allMovies,
  correctMovies,
  correctActor,
  configuration,
  actorDetails,
  actorFinishedIn,
}: {
  allMovies: KnownFor[];
  correctMovies: KnownFor[];
  correctActor: Result;
  configuration: Configuration;
  actorDetails: Actor;
  actorFinishedIn: number;
}) => {
  const { toast } = useToast();
  const [moviesToRender, setMoviesToRender] = useState<RenderMovie>(
    correctMovies.map((movie) => ({
      blurred: true,
      movie: movie,
    }))
  );
  const [correctAnswers, addCorrectAnswers] = useState(0);
  const [end, setEnd] = useState(false);
  const [open, setOpen] = useState(false);

  const [guesses, addGuess] = useState<string[]>([]);

  const throwConfetti = useConfetti();
  const [wrongGuess, showWrongGuess] = useWrongGuess();

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

  const submitChoice = (choice?: string) => {
    setOpen(false);
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
      }
    });
    allIncorrect && showWrongGuess();
  };

  /**
   * Handle game ending
   */
  useEffect(() => {
    if (guesses.length == MAX_MOVIE_GUESSES) {
      const unBlurred = correctMovies.map((movie) => ({
        blurred: false,
        movie: movie,
      }));
      setMoviesToRender(unBlurred);
      setEnd(true);
    }
  }, [correctMovies, guesses]);

  /** Return variant of blurred depending of the guesses length or an animation if the movie is guessed */
  const getBlurredClass = (blurred: boolean) => {
    if (!blurred) return 'animate-scale';
    const classes = ['blur-lg', 'blur-md', 'blur', 'blur-sm', 'blur-none'];
    const index = Math.min(guesses.length, classes.length);
    return classes[index];
  };

  const shareResults = () => {
    const text = buildShareText({
      actorGuesses: actorFinishedIn,
      moviesGuesses: correctAnswers,
    });
    navigator.clipboard.writeText(text);
    console.log(text);
    toast({ title: 'Results copied to clipboard !' });
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
            movie.title ?? movie.name
          )}
          <Image
            width={180}
            height={100}
            src={`${configuration.images.base_url}/w185/${movie.backdrop_path}`}
            alt={
              blurred
                ? 'movie to guess'
                : movie.title ?? movie.name ?? 'famous movie'
            }
            className={`rounded-md drop-shadow-md ${getBlurredClass(blurred)}`}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className='flex flex-col gap-2 items-center animate-in zoom-in duration-300'>
      <H2>
        Round 2, guess {correctActor.gender === 1 ? 'her' : 'his'} movies and tv
        shows
      </H2>
      {!end && (
        <>
          <div>
            Tries : {guesses.length + 1} / {MAX_MOVIE_GUESSES}
          </div>
          <div className='relative flex w-full max-w-xs '>
            <div className='flex flex-1'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between rounded-r-none'
                  >
                    Select movies...
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0 bg-background'>
                  <Command>
                    <CommandInput placeholder='Search movies...' />
                    <CommandEmpty>No actor found.</CommandEmpty>
                    <CommandList className='text-secondary'>
                      {allMovies.map((movie) => (
                        <CommandItem
                          key={movie.title}
                          value={movie.title}
                          onSelect={() => submitChoice(movie.id.toString())}
                          onClick={() => submitChoice(movie.id.toString())}
                        >
                          <CircleX
                            className={cn(
                              'mr-2 h-4 w-4',
                              guesses.includes(movie.id.toString())
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {movie.title}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

      <Button
        className='mt-4 bg-imdb text-black hover:bg-imdb/90'
        disabled={!end}
        title={
          !end
            ? 'Button is disabled until the game is still going'
            : 'Find more on IMDb'
        }
        onClick={() =>
          window.open(`https://www.imdb.com/name/${actorDetails.imdb_id}/`)
        }
      >
        Find more on IMDb
      </Button>

      {end && <ShareResults handleClick={shareResults} />}
    </div>
  );
};
