export type MovieStatus = 'to_watch' | 'watching' | 'watched';

export interface Movie {
    _id: string;
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
    trailerKey?: string;
    status: MovieStatus;
    rating?: number;
    review?: string;
    createdAt: Date;
}

export interface CreateMovieDTO {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
    trailerKey?: string;
    status: MovieStatus;
}

export interface UpdateMediaDTO {
    status?: MovieStatus;
    rating?: number;
    review?: string;
}

export interface MediaSearchResult {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
}

export interface CastMember {
    name: string;
    character: string;
    photoUrl?: string | undefined;
}

export interface SimilarMedia {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
}

export interface MovieDetails {
    overview: string;
    cast: CastMember[];
    trailerKey?: string | undefined;
    similar: SimilarMedia[];
}

export type AirStatus = 'returning' | 'ended' | 'canceled';

export interface Show {
    _id: string;
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
    trailerKey?: string;
    status: MovieStatus;
    rating?: number;
    review?: string;
    createdAt: Date;
}

export interface CreateShowDTO {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
    trailerKey?: string;
    status: MovieStatus;
}

export interface ShowDetails {
    overview: string;
    cast: CastMember[];
    trailerKey?: string | undefined;
    similar: SimilarMedia[];
    numberOfSeasons: number;
    numberOfEpisodes: number;
    airStatus: AirStatus;
}

// Tipo unificado pra exibir filmes e séries juntos na mesma lista
export type MediaItem =
    | (Movie & { kind: 'movie' })
    | (Show & { kind: 'show' });
