import { useState, useEffect, useCallback } from 'react';
import type { Movie, CreateMovieDTO, UpdateMovieDTO } from '../types';
import * as api from '../services/api';

export function useMovies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Carrega filmes do banco
    const fetchMovies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getMovies();
            setMovies(data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar os filmes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // Função para adicionar filme
    const addMovie = async (movieData: CreateMovieDTO) => {
        try {
            const newMovie = await api.createMovie(movieData);
            setMovies((prev) => [newMovie, ...prev]);
            return newMovie;
        } catch (err) {
            console.error(err);
            throw new Error('Não foi possível salvar o filme.');
        }
    };

    // Função para atualizar filme
    const editMovie = async (id: string, movieData: UpdateMovieDTO) => {
        try {
            const updated = await api.updateMovie(id, movieData);
            setMovies((prev) => prev.map((m) => (m._id === id ? updated : m)));
            return updated;
        } catch (err) {
            console.error(err);
            throw new Error('Não foi possível atualizar o filme.');
        }
    };

    // Função para remover filme
    const removeMovie = async (id: string) => {
        try {
            await api.deleteMovie(id);
            setMovies((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
            console.error(err);
            throw new Error('Não foi possível remover o filme.');
        }
    };

    return {
        movies,
        loading,
        error,
        refreshMovies: fetchMovies,
        addMovie,
        editMovie,
        removeMovie,
    };
}