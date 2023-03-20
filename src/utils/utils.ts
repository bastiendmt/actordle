export const replaceAt = (word: string, index: number, replacement: string) => {
  return (
    word.substring(0, index) +
    replacement +
    word.substring(index + replacement.length)
  );
};
