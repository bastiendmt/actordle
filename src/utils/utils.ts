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
