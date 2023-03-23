'use client';

import { KnownFor } from '@/types/types';

export const Movies = ({ movies }: { movies: KnownFor[] }) => {
  return (
    <div>
      <h2>Movies</h2>
      {movies.length}
    </div>
  );
};
