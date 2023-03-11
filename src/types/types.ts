export interface ActorsData {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

export interface Result {
  adult: boolean;
  gender: number;
  id: number;
  known_for: KnownFor[];
  known_for_department: KnownForDepartment;
  name: string;
  popularity: number;
  profile_path: string;
}

export interface KnownFor {
  backdrop_path?: string;
  first_air_date?: Date;
  genre_ids: number[];
  id: number;
  media_type: MediaType;
  name?: string;
  origin_country?: OriginCountry[];
  original_language: OriginalLanguage;
  original_name?: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  adult?: boolean;
  original_title?: string;
  release_date?: Date;
  title?: string;
  video?: boolean;
}

export enum MediaType {
  Movie = 'movie',
  Tv = 'tv',
}

export enum OriginCountry {
  Jp = 'JP',
  Us = 'US',
}

export enum OriginalLanguage {
  En = 'en',
  It = 'it',
  Ja = 'ja',
  Ko = 'ko',
  Tl = 'tl',
}

export enum KnownForDepartment {
  Acting = 'Acting',
  Directing = 'Directing',
}

export interface Configuration {
  images: Images;
  change_keys: string[];
}

export interface Images {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
}
