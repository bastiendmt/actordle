import { useConfetti } from '@/hooks/useConfetti';
import { useWrongGuess } from '@/hooks/useWrongGuess';
import { Result } from '@/types/types';
import { buildShareText } from '@/utils/buildShareText';
import { MAX_ACTOR_GUESSES } from '@/utils/constant';
import { cn, replaceAt } from '@/utils/utils';
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
import { ShareResults } from './shareResults';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

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
  const [success, setSuccess] = useState(false);
  const [end, setEnd] = useState(false);
  const [showList, setShowList] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

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
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({ title: 'Results copied to clipboard !' });
      })
      .catch(() => {
        toast({
          title: 'An error has occurred',
          description: 'Please try again later',
        });
      });
    console.log(text);
  };

  return (
    <div className='flex flex-col gap-2 items-center animate-in zoom-in duration-300'>
      <H2>{nameHint}</H2>
      {!end && (
        <>
          <div>
            Tries : {guesses.length + 1} / {MAX_ACTOR_GUESSES}
          </div>
          <div className='relative flex w-full max-w-xs'>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  role='combobox'
                  aria-expanded={open}
                  className='w-[200px] justify-between'
                >
                  {value
                    ? filteredActors.find((actor) => actor.name === value)?.name
                    : 'Select actor...'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput placeholder='Search actor...' />
                  <CommandEmpty>No actor found.</CommandEmpty>
                  <CommandList>
                    {filteredActors.map((actor) => (
                      <CommandItem
                        key={actor.name}
                        value={actor.name}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === actor.name ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {actor.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className='relative flex w-full max-w-xs'>
            <div className='flex flex-1'>
              <Input
                placeholder='Filter actors'
                className='max-w-[18rem] rounded-r-none text-base'
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onFocus={() => setShowList(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowList(false);
                  }, 200);
                }}
              />
              {showList && (
                <ScrollArea className='!absolute bottom-12 max-h-80 w-full max-w-xs overflow-scroll overflow-x-hidden rounded-md border border-teal-400 bg-background dark:border-slate-700'>
                  <div className='px-3'>
                    <h4 className='my-4 text-sm leading-none text-secondary'>
                      Actors
                    </h4>
                    {filteredActors.map((actor) => (
                      <div key={actor.id}>
                        <div
                          onClick={() => submitChoice(actor)}
                          onKeyDown={(event) => {
                            event.key === 'Enter' && submitChoice(actor);
                          }}
                          tabIndex={0}
                          className={
                            'cursor-pointer rounded-md p-2 transition duration-150 hover:scale-105 hover:bg-tertiary'
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
        <H3 classes='text-primary animate-in zoom-in duration-300'>
          You won !
        </H3>
      )}
      {end && !success && (
        <>
          <H3 classes='text-failure animate-in zoom-in duration-300'>
            You lost :(
          </H3>
          <div>Maybe you will have more luck tomorrow.</div>
        </>
      )}

      {end && <ShareResults handleClick={shareResults} />}

      {process.env.NODE_ENV === 'development' && (
        <div className='flex flex-col rounded-md p-2 align-middle bg-fourth'>
          <i>_debug section</i>
          <strong>actor: {correctActor.name}</strong>
          <div>
            {correctActor.known_for.map((movie) => (
              <p key={movie.id}>
                {movie.title ?? movie.original_title ?? movie.name}
              </p>
            ))}
          </div>
          <div className='flex justify-center gap-2 p-2'>
            <Button variant='outline' onClick={() => endGame(true)}>
              WIN
            </Button>
            <Button variant='destructive' onClick={() => endGame(false)}>
              LOOSE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
