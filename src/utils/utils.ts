import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const replaceAt = (word: string, index: number, replacement: string) => {
  return (
    word.substring(0, index) +
    replacement +
    word.substring(index + replacement.length)
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDayIndex = (): number => {
  const now = new Date();
  const firstJanuary = new Date(now.getFullYear(), 0, 1);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysSinceJanuaryFirst = Math.floor(
    (now.getTime() - firstJanuary.getTime()) / millisecondsPerDay
  );
  return daysSinceJanuaryFirst;
};
