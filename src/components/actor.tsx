import { Configuration, Result } from '@/types/types';
import { replaceAt } from '@/utils/utils';
import type { FireworksHandlers } from '@fireworks-js/react';
import { Fireworks } from '@fireworks-js/react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { H2, H3 } from './ui/titles';

const LIMIT = 3;

export const Actor = ({
  allActors,
  correctActor,
  configuration,
  setActorFinished,
}: {
  allActors: Result[];
  correctActor: Result;
  configuration: Configuration;
  setActorFinished: Dispatch<SetStateAction<boolean>>;
}) => {
  const [userInput, setUserInput] = useState('');
  const [filteredList, setFilteredList] = useState(allActors);

  const [guesses, addGuess] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<string>();
  const [end, setEnd] = useState<boolean>(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const [nameHint, setNameHint] = useState(
    correctActor.name.replace(/[a-zA-Z0-9]/gi, '_')
  );

  const ref = useRef<FireworksHandlers>(null);

  const toggle = () => {
    if (!ref.current) return;
    if (ref.current.isRunning) {
      ref.current.stop();
    } else {
      ref.current.start();
    }
  };

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
    setNameHint(correctActor.name);
    setActorFinished(true);

    setShowFireworks(true);
    setTimeout(() => {
      setShowFireworks(false);
    }, 2500);
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
    //  if (hint === 1) {
    //    setMovieHints(1);
    //  }
    //  if (hint === 2) {
    //    setMovieHints(2);
    //  }
  };

  const getHint = () => {
    if (guesses.length > LIMIT) return;
    addGuess((oldState) => [...oldState, '']);
    showHint(guesses.length);
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
      <div>
        Tries : {guesses.length + 1} / {LIMIT}
      </div>
      {!end && (
        <div className='flex gap-4'>
          <Button variant='subtle' onClick={getHint}>
            Get a hint
          </Button>
          <Button onClick={submitChoice}>Submit</Button>
        </div>
      )}

      {success && <H3 classes='text-green-600'>You won !</H3>}
      {end && !success && (
        <>
          <H3 classes='text-red-600'>You lost :(</H3>
          <div>Maybe you will have more luck tomorrow</div>
        </>
      )}

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

      <>
        {/* <div
          style={{
            display: 'flex',
            gap: '4px',
            position: 'absolute',
            zIndex: 1,
          }}
        >
          <button onClick={() => toggle()}>Toggle</button>
          <button onClick={() => ref.current!.clear()}>Clear</button>
        </div> */}
      </>

      {process.env.NODE_ENV === 'development' && (
        <div className='flex flex-col rounded-md bg-zinc-200 p-2 align-middle'>
          <i>_debug section</i>
          <strong>actor: {correctActor.name}</strong>
          <div>
            {correctActor.known_for.map((movie) => (
              <p key={movie.id}>{movie.original_title}</p>
            ))}
          </div>
          <div className='flex justify-center gap-2 p-2'>
            <Button className='bg-emerald-400' onClick={() => endGame(true)}>
              WIN
            </Button>
            <Button className='bg-red-400' onClick={() => endGame(false)}>
              LOOSE
            </Button>
            <Button variant={'outline'} onClick={toggle}>
              fireworks
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
