import { Configuration, KnownFor } from '@/types/types';
import Image from 'next/image';

export const playedIn = (movies: KnownFor[], configuration: Configuration) =>
  movies.map((movie) => (
    <div key={movie.id} className='my-1'>
      <div>{movie.original_title}</div>
      <Image
        width={180}
        height={100}
        src={`${configuration.images.base_url}/w185/${movie.backdrop_path}`}
        alt={movie.original_title || 'famous movie'}
        className='rounded-md drop-shadow-md'
      />
    </div>
  ));
