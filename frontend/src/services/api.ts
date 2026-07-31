import axios from 'axios';
import type {
    Movie,
    Show,
    CreateMovieDTO,
    CreateShowDTO,
    UpdateMediaDTO,
    MediaSearchResult,
    MovieDetails,
    ShowDetails,
} from '../types';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// TMDB: filmes 

export const searchTmdbMovies = async (query: string): Promise<MediaSearchResult[]> => {
    const response = await api.get<MediaSearchResult[]>(`/tmdb/search?query=${encodeURIComponent(query)}`);
    return response.data;
};

export const getMovieDetails = async (tmdbId: number): Promise<MovieDetails> => {
    const response = await api.get<MovieDetails>(`/tmdb/${tmdbId}/details`);
    return response.data;
};

// TMDB: séries 

export const searchTmdbShows = async (query: string): Promise<MediaSearchResult[]> => {
    const response = await api.get<MediaSearchResult[]>(`/tmdb/tv/search?query=${encodeURIComponent(query)}`);
    return response.data;
};

export const getShowDetails = async (tmdbId: number): Promise<ShowDetails> => {
    const response = await api.get<ShowDetails>(`/tmdb/tv/${tmdbId}/details`);
    return response.data;
};

// Coleção pessoal: filmes 

export const getMovies = async (): Promise<Movie[]> => {
    const response = await api.get<Movie[]>('/movies');
    return response.data;
};

export const getMovieById = async (id: string): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
};

export const createMovie = async (movieData: CreateMovieDTO): Promise<Movie> => {
    const response = await api.post<Movie>('/movies', movieData);
    return response.data;
};

export const updateMovie = async (id: string, movieData: UpdateMediaDTO): Promise<Movie> => {
    const response = await api.put<Movie>(`/movies/${id}`, movieData);
    return response.data;
};

export const deleteMovie = async (id: string): Promise<void> => {
    await api.delete(`/movies/${id}`);
};

// Coleção pessoal: séries 

export const getShows = async (): Promise<Show[]> => {
    const response = await api.get<Show[]>('/shows');
    return response.data;
};

export const getShowById = async (id: string): Promise<Show> => {
    const response = await api.get<Show>(`/shows/${id}`);
    return response.data;
};

export const createShow = async (showData: CreateShowDTO): Promise<Show> => {
    const response = await api.post<Show>('/shows', showData);
    return response.data;
};

export const updateShow = async (id: string, showData: UpdateMediaDTO): Promise<Show> => {
    const response = await api.put<Show>(`/shows/${id}`, showData);
    return response.data;
};

export const deleteShow = async (id: string): Promise<void> => {
    await api.delete(`/shows/${id}`);
};
