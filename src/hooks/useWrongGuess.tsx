import { useEffect, useState } from 'react';

export const useWrongGuess = (): [JSX.Element, () => void] => {
  const [showIncorrect, setShowIncorrect] = useState(false);

  /** remove message after 2s */
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showIncorrect) {
      timer = setTimeout(() => {
        setShowIncorrect(false);
      }, 2000);
    }
    return () => timer && clearTimeout(timer);
  }, [showIncorrect]);

  const message = (
    <div
      className={`text-red-400 ${
        showIncorrect ? 'animate-shake opacity-100' : 'opacity-0'
      }`}
    >
      wrong guess
    </div>
  );

  return [message, () => setShowIncorrect(true)];
};
