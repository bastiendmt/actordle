import { Game } from '@/components/game';
import {
  Actor,
  ActorsData,
  Configuration,
  KnownFor,
  Result,
} from '@/types/types';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const getActors = async (page = 1): Promise<ActorsData> => {
  const data = await fetch(
    `https://api.themoviedb.org/3/trending/person/day?api_key=${TMDB_API_KEY}&page=${page}`
  );
  return data.json();
};

const getActorDetails = async (actorId: number): Promise<Actor> => {
  const data = await fetch(
    `https://api.themoviedb.org/3/person/${actorId}?api_key=${TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 60 * 60 * 24 } }
  );
  if (data.ok) {
    return data.json();
  }
  throw new Error('could not get details');
};

const getConfiguration = async (): Promise<Configuration> => {
  const data = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${TMDB_API_KEY}`,
    { next: { revalidate: 60 * 60 * 24 } }
  );
  return data.json();
};

export default async function Home() {
  let actors: Result[] = [];

  for (let i = 0; i < 5; i++) {
    const data = await getActors(i);
    if (data.results) actors.push(...data.results);
  }

  const configuration = await getConfiguration();

  const filteredActors = actors.filter((actor) => {
    if (actor.known_for.some((movie) => movie.original_language === 'ko')) {
      return;
    }

    if (
      actor.known_for_department === 'Acting' &&
      actor.known_for.length !== 0
    ) {
      return actor;
    }
  });

  // const randomIndex = new Date().getDay();
  const randomIndex = Math.floor(Math.random() * filteredActors.length);
  const randomActor = filteredActors[randomIndex];
  const imageURI = `${configuration.images.base_url}/w185/${randomActor.profile_path}`;

  const actorDetails = await getActorDetails(randomActor.id);

  const allMovies: KnownFor[] = [];
  filteredActors.forEach((actor) => {
    actor.known_for.forEach((movie) => {
      // prevent from adding the same movie to the list
      if (!allMovies.some((m) => m.id === movie.id)) {
        allMovies.push(movie);
      }
    });
  });

  filteredActors.sort((a, b) => (a.name < b.name ? -1 : 0));

  allMovies.sort((a, b) =>
    (a.original_title || a.name || '') < (b.original_title || b.name || '')
      ? -1
      : 0
  );
  const correctMovies = randomActor.known_for;

  return (
    <React.StrictMode>
      <main className='flex min-h-screen flex-col items-center gap-2 bg-zinc-100 p-4'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl'>
          🎬 Actordle
        </h1>
        <canvas
          id='confetti'
          className='pointer-events-none fixed z-50 h-full w-full'
        ></canvas>
        <Image
          src={imageURI}
          alt='Actor to guess'
          width={180}
          height={250}
          className='rounded-lg drop-shadow-lg'
        />
        <Game
          allActors={filteredActors}
          actorDetails={actorDetails}
          correctActor={randomActor}
          allMovies={allMovies}
          correctMovies={correctMovies}
          configuration={configuration}
        />
      </main>
    </React.StrictMode>
  );
}
