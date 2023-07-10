import { useConfetti } from '@/hooks/useConfetti';
import { useWrongGuess } from '@/hooks/useWrongGuess';
import { Result } from '@/types/types';
import { buildShareText } from '@/utils/buildShareText';
import { MAX_ACTOR_GUESSES } from '@/utils/constant';
import { replaceAt } from '@/utils/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { H2, H3 } from './ui/titles';
import { useToast } from './ui/use-toast';

export const ActorGuess = ({
  allActors,
  correctActor,
  setActorFinishedIn,
}: {
  allActors: Result[];
  correctActor: Result;
  setActorFinishedIn: Dispatch<SetStateAction<number>>;
}) => {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState('');

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [end, setEnd] = useState<boolean>(false);
  const [showList, setShowList] = useState(false);

  const [nameHint, setNameHint] = useState(
    correctActor.name.replace(/[\p{L}\p{N}]/gu, '_')
  );

  const throwConfetti = useConfetti();
  const [wrongGuess, showWrongGuess] = useWrongGuess();

  const filteredActors = allActors.filter((actor) =>
    actor.name.toLowerCase().includes(userInput.toLowerCase())
  );

  const submitChoice = (choice?: Result) => {
    setShowList(false);
    if (!choice) {
      addGuess((oldState) => [...oldState, '']);
      return;
    }

    addGuess((oldState) => [...oldState, choice.id.toString()]);
    if (choice.id.toString() === correctActor.id.toString()) {
      endGame(true);
    } else {
      showWrongGuess();
    }

    showHint(guesses.length);
    setUserInput('');
  };

  const endGame = useCallback(
    (success: boolean) => {
      setEnd(true);
      setSuccess(success);
      setNameHint(correctActor.name);
      setActorFinishedIn(guesses.length + 1);

      success && throwConfetti();
    },
    [correctActor.name, guesses.length, setActorFinishedIn, throwConfetti]
  );

  /** Debug to 2n round */
  // useEffect(() => {
  //   endGame(true);
  // }, []);

  const showHint = useCallback(
    (hint: number) => {
      if (hint === 1) {
        const index = 0;
        setNameHint((hidden) =>
          replaceAt(hidden, index, correctActor.name[index])
        );
      }
      if (hint === 2) {
        const lastName = correctActor.name.split(' ')[1];
        const index = correctActor.name.indexOf(lastName);
        setNameHint((hidden) =>
          replaceAt(hidden, index, correctActor.name[index])
        );
      }
    },
    [correctActor.name]
  );

  useEffect(() => {
    if (guesses.length == MAX_ACTOR_GUESSES) {
      !end && endGame(false);
    }
    showHint(guesses.length);
  }, [end, endGame, guesses, showHint]);

  const shareResults = () => {
    const text = buildShareText({ actorGuesses: success ? guesses.length : 0 });
    navigator.clipboard.writeText(text);
    console.log(text);
    toast({ title: 'Results copied to clipboard !' });
  };

  return (
    <>
      <H2>{nameHint}</H2>
      {!end && (
        <>
          <div>
            Tries : {guesses.length + 1} / {MAX_ACTOR_GUESSES}
          </div>
          <div className='relative flex w-full max-w-xs'>
            <div className='flex flex-1'>
              <Input
                placeholder='Filter actors'
                className='max-w-[18rem] rounded-r-none bg-zinc-50 text-base'
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
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
                <ScrollArea className='!absolute bottom-12 max-h-80 w-full max-w-xs overflow-scroll overflow-x-hidden rounded-md border border-teal-400 bg-zinc-50 dark:border-slate-700'>
                  <div className='px-3'>
                    <h4 className='my-4 text-sm leading-none text-gray-500'>
                      Actors
                    </h4>
                    {filteredActors.map((actor) => (
                      <div key={actor.id}>
                        <div
                          onClick={() => submitChoice(actor)}
                          onKeyDown={(event) =>
                            event.key === 'Enter' && submitChoice(actor)
                          }
                          tabIndex={0}
                          className={
                            'cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-teal-200'
                          }
                        >
                          {actor.name}
                        </div>
                        <Separator className='my-2' />
                      </div>
                    ))}
                    {filteredActors.length === 0 && (
                      <div className='p-2'>No actors found</div>
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
        </>
      )}

      {success && (
        <H3 classes='text-green-600 animate-in zoom-in duration-300'>
          You won !
        </H3>
      )}
      {end && !success && (
        <>
          <H3 classes='text-red-600 animate-in zoom-in duration-300'>
            You lost :(
          </H3>
          <div>Maybe you will have more luck tomorrow</div>
        </>
      )}

      {end && (
        <Button
          className='mt-4 bg-green-600 text-white animate-in zoom-in duration-300 hover:bg-green-500'
          onClick={shareResults}
        >
          Share my results
        </Button>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className='flex flex-col rounded-md bg-zinc-200 p-2 align-middle'>
          <i>_debug section</i>
          <strong>actor: {correctActor.name}</strong>
          <div>
            {correctActor.known_for.map((movie) => (
              <p key={movie.id}>{movie.title ?? movie.original_title}</p>
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
