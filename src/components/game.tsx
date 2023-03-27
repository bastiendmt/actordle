'use client';

import { Configuration, KnownFor, Result } from '@/types/types';
import { useState } from 'react';
import { Actor } from './actor';
import { Movies } from './movies';

/** Manage game rounds */
export const Game = ({
  allActors,
  correctActor,
  configuration,
  allMovies,
  correctMovies,
}: {
  allActors: Result[];
  correctActor: Result;
  configuration: Configuration;
  allMovies: KnownFor[];
  correctMovies: KnownFor[];
}) => {
  const [actorFinished, setActorFinished] = useState(false);

  return (
    <>
      <Actor
        allActors={allActors}
        correctActor={correctActor}
        setActorFinished={setActorFinished}
      />
      {actorFinished && (
        <Movies
          allMovies={allMovies}
          correctMovies={correctMovies}
          correctActor={correctActor}
          configuration={configuration}
        />
      )}
    </>
  );
};
