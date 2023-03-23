import { Game } from '@/components/game';
import { ActorsData, Configuration } from '@/types/types';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import React from 'react';
import styles from './page.module.css';

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
  const randomActor = actors[Math.floor(Math.random() * actors.length)];

  const imageURI = `${configuration.images.base_url}/w185/${randomActor.profile_path}`;

  return (
    <React.StrictMode>
      <main className={styles.main}>
        <h1 className='text-3xl font-bold'>Actordle</h1>
        <Image
          src={imageURI}
          alt='Actor to guess'
          width={180}
          height={250}
          className='rounded-lg'
        />
        <Game list={actors} actor={randomActor} configuration={configuration} />
      </main>
    </React.StrictMode>
  );
}
