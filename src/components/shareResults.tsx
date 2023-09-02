import { Button } from './ui/button';

export const ShareResults = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <Button
      className='mt-4 animate-in zoom-in duration-300'
      onClick={handleClick}
      variant='tertiary'
    >
      Share my results
    </Button>
  );
};
