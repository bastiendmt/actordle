import confetti from 'canvas-confetti';

export const useConfetti = () => {
  if (typeof window === 'undefined') {
    return () => console.error('this hook cannot run on server');
  }

  const canvas = document.getElementById('confetti') as HTMLCanvasElement;
  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true,
  });

  return () =>
    myConfetti({
      particleCount: 150,
      spread: 160,
    });
};
