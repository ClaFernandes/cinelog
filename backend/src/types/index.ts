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

// Compartilhado entre Movie e Show — os campos que o usuário atualiza
export interface UpdateMediaDTO {
    status?: MovieStatus;
    rating?: number;
    review?: string;
}

// Formato cru de um resultado de busca de filme na TMDB 
export interface TmdbResultDTO {
    id: number;
    title: string;
    release_date: string;
    genre_ids: number[];
    poster_path: string;
}

// Formato cru de um resultado de busca de série na TMDB 
export interface TmdbShowResultDTO {
    id: number;
    name: string;
    first_air_date: string;
    genre_ids: number[];
    poster_path: string;
}

// Compartilhado entre busca de filme e de série 
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

// Compartilhado entre recomendações de filme e de série
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

// Status de exibição da série 
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

// Igual ao CreateMovieDTO
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
