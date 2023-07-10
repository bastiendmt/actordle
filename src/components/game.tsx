'use client';

import { Actor, Configuration, KnownFor, Result } from '@/types/types';
import { useState } from 'react';
import { ActorGuess } from './actor';
import { Movies } from './movies';

/** Manage game rounds */
export const Game = ({
  allActors,
  correctActor,
  configuration,
  allMovies,
  correctMovies,
  actorDetails,
}: {
  allActors: Result[];
  correctActor: Result;
  configuration: Configuration;
  allMovies: KnownFor[];
  correctMovies: KnownFor[];
  actorDetails: Actor;
}) => {
  const [actorFinishedIn, setActorFinishedIn] = useState(0);

  return (
    <>
      <ActorGuess
        allActors={allActors}
        correctActor={correctActor}
        setActorFinishedIn={setActorFinishedIn}
      />
      {Boolean(actorFinishedIn) && (
        <Movies
          allMovies={allMovies}
          correctMovies={correctMovies}
          correctActor={correctActor}
          actorDetails={actorDetails}
          configuration={configuration}
          actorFinishedIn={actorFinishedIn}
        />
      )}
    </>
  );
};
