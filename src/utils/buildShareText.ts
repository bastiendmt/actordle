import { MAX_ACTOR_GUESSES } from './constant';

export const buildShareText = ({
  actorGuesses,
  moviesGuesses,
}: {
  actorGuesses: number;
  moviesGuesses?: number;
}) => {
  let textToCopy = `🎬 Actordle`;

  if (actorGuesses === 0) {
    textToCopy += `\nCould not find the Actor 😢`;
  } else {
    textToCopy += `\nActor guessed in ${actorGuesses}/${MAX_ACTOR_GUESSES} 🎉`;
  }

  if (moviesGuesses !== undefined) {
    textToCopy += `\nMovies guessed ${moviesGuesses}/3 `;
    textToCopy += moviesGuesses > 0 ? '🎉' : '😢';
  }

  textToCopy += `\nhttps://actordle.vercel.app/`;
  return textToCopy;
};
