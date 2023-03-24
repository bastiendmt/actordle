import { Game } from '@/components/game';
import { Movies } from '@/components/movies';
import { ActorsData, Configuration, KnownFor } from '@/types/types';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const getActors = async (page = 1): Promise<ActorsData> => {
  const data = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
  );
  return data.json();
};

const getConfiguration = async (): Promise<Configuration> => {
  const data = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${TMDB_API_KEY}`
  );
  return data.json();
};

export default async function Home() {
  const { results: actors } = await getActors();
  const configuration = await getConfiguration();

  // TODO filter only actors with known_for_department
  // TODO pick one actor per day
  const randomIndex = Math.floor(Math.random() * actors.length);
  const randomActor = actors[randomIndex];
  const imageURI = `${configuration.images.base_url}/w185/${randomActor.profile_path}`;

  const allMovies: KnownFor[] = [];
  actors.forEach((actor) => {
    console.log(actor.known_for.length);
    actor.known_for.forEach((movie) => allMovies.push(movie));
  });
  const correctMovies = randomActor.known_for;

  return (
    <React.StrictMode>
      <main className='flex min-h-screen flex-col items-center gap-2 p-4'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl'>
          Actordle
        </h1>
        <Image
          src={imageURI}
          alt='Actor to guess'
          width={180}
          height={250}
          className='rounded-lg drop-shadow-lg'
        />
        <Game list={actors} actor={randomActor} configuration={configuration} />
        <Movies allMovies={allMovies} correctMovies={correctMovies} />
      </main>
    </React.StrictMode>
  );
}
