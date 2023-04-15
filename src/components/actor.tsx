import { useConfetti } from '@/hooks/useConfetti';
import { useWrongGuess } from '@/hooks/useWrongGuess';
import { Result } from '@/types/types';
import { replaceAt } from '@/utils/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { H2, H3 } from './ui/titles';

const MAX_GUESSES = 3;

export const ActorGuess = ({
  allActors,
  correctActor,
  setActorFinished,
}: {
  allActors: Result[];
  correctActor: Result;
  setActorFinished: Dispatch<SetStateAction<boolean>>;
}) => {
  const [userInput, setUserInput] = useState('');

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<Result>();
  const [end, setEnd] = useState<boolean>(false);
  const [showList, setShowList] = useState(false);

  const [nameHint, setNameHint] = useState(
    correctActor.name.replace(/[a-zA-Z0-9]/gi, '_')
  );

  const throwConfetti = useConfetti();
  const [wrongGuess, showWrongGuess] = useWrongGuess();

  const filteredActors = allActors.filter((actor) =>
    actor.name.toLowerCase().includes(userInput.toLowerCase())
  );

  const submitChoice = () => {
    if (!userChoice) {
      addGuess((oldState) => [...oldState, '']);
      return;
    }

    addGuess((oldState) => [...oldState, userChoice.id.toString()]);
    if (userChoice.id.toString() === correctActor.id.toString()) {
      endGame(true);
    } else {
      showWrongGuess();
    }

    showHint(guesses.length);
    setUserChoice(undefined);
    setUserInput('');
  };

  const endGame = (success: boolean) => {
    setEnd(true);
    setSuccess(success);
    setNameHint(correctActor.name);
    setActorFinished(true);

    success && throwConfetti();
  };

  /** Debug to 2n round */
  // useEffect(() => {
  //   endGame(true);
  // }, []);

  useEffect(() => {
    if (guesses.length == MAX_GUESSES) {
      !end && endGame(false);
    }
    showHint(guesses.length);
  }, [guesses]);

  const showHint = (hint: number) => {
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
  };

  return (
    <>
      <H2>{nameHint}</H2>
      {!end && (
        <>
          <div>
            Tries : {guesses.length + 1} / {MAX_GUESSES}
          </div>
          <div className='relative flex w-full max-w-xs'>
            <div className='flex flex-1'>
              <Input
                placeholder='Filter actors'
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                className='max-w-[18rem] rounded-r-none bg-zinc-50'
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
              <ScrollArea className='!absolute bottom-12 h-80 w-full max-w-xs overflow-scroll overflow-x-hidden rounded-md border border-teal-400 bg-zinc-50 dark:border-slate-700'>
                <div className='px-3'>
                  <h4 className='my-4 text-sm leading-none text-gray-500'>
                    Actors
                  </h4>
                  {filteredActors.map((actor) => (
                    <div key={actor.id}>
                      <div
                        onClick={() => {
                          setUserInput(actor.name);
                          setUserChoice(actor);
                          setShowList(false);
                        }}
                        className={`
                    cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-teal-200
                    ${
                      userChoice?.id.toString() == actor.id.toString()
                        ? 'bg-teal-200'
                        : ''
                    }
                    `}
                      >
                        {actor.name}
                      </div>
                      <Separator className='my-2' />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
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

      {process.env.NODE_ENV === 'development' && false && (
        <div className='flex flex-col rounded-md bg-zinc-200 p-2 align-middle'>
          <i>_debug section</i>
          <strong>actor: {correctActor.name}</strong>
          <div>
            {correctActor.known_for.map((movie) => (
              <p key={movie.id}>{movie.original_title || movie.name}</p>
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
