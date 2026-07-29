import axios from 'axios';
import type { Movie, CreateMovieDTO, UpdateMovieDTO, TmdbSearchResult } from '../types';

export const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Busca filmes no TMDB (autocomplete)
export const searchTmdbMovies = async (query: string): Promise<TmdbSearchResult[]> => {
    const response = await api.get<TmdbSearchResult[]>(`/tmdb/search?query=${encodeURIComponent(query)}`);
    return response.data;
};

// Busca todos os filmes salvos no MongoDB
export const getMovies = async (): Promise<Movie[]> => {
    const response = await api.get<Movie[]>('/movies');
    return response.data;
};

// Adiciona um filme à coleção
export const createMovie = async (movieData: CreateMovieDTO): Promise<Movie> => {
    const response = await api.post<Movie>('/movies', movieData);
    return response.data;
};

// Atualiza status/nota/resenha de um filme pelo ID
export const updateMovie = async (id: string, movieData: UpdateMovieDTO): Promise<Movie> => {
    const response = await api.put<Movie>(`/movies/${id}`, movieData);
    return response.data;
};

// Remove um filme da coleção
export const deleteMovie = async (id: string): Promise<void> => {
    await api.delete(`/movies/${id}`);
};