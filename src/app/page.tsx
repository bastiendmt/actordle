import { ActorsData, Configuration } from '@/types/types';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] });

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const getActors = async (): Promise<ActorsData> => {
  const data = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
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
  console.log(configuration);
  const choices = actors.map((actor) => actor);
  const randomActor = actors[Math.floor(Math.random() * actors.length)];

  const imageURI = `${configuration.images.base_url}/w185/${randomActor.profile_path}`;

  return (
    <main className={styles.main}>
      <h1>Picked actor is {randomActor.name}</h1>
      <Image src={imageURI} alt='Actor to guess' width={180} height={250} />
      <select>
        {choices.map((choice) => (
          <option key={choice.id} value={choice.name}>
            {choice.name}
          </option>
        ))}
      </select>
    </main>
  );
}
