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

export interface UpdateMovieDTO {
    status?: MovieStatus;
    rating?: number;
    review?: string;
}

export interface TmdbSearchResult {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
}

export interface CastMember {
    name: string;
    character: string;
    photoUrl?: string;
}

export interface SimilarMovie {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
}

export interface MovieDetails {
    overview: string;
    cast: CastMember[];
    trailerKey?: string;
    similar: SimilarMovie[];
}
