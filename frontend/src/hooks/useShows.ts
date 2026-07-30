import { useState, useEffect, useCallback } from 'react';
import type { Show, CreateShowDTO, UpdateMediaDTO } from '../types';
import * as api from '../services/api';

// Espelha o useMovies.ts — mesma estrutura, só trocando Movie por Show
export function useShows() {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Carrega séries do banco
    const fetchShows = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getShows();
            setShows(data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar as séries.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShows();
    }, [fetchShows]);

    // Função para adicionar série
    const addShow = async (showData: CreateShowDTO) => {
        try {
            const newShow = await api.createShow(showData);
            setShows((prev) => [newShow, ...prev]);
            return newShow;
        } catch (err) {
            console.error(err);
            throw new Error('Não foi possível salvar a série.');
        }
    };

    // Função para atualizar série 
    const editShow = async (id: string, showData: UpdateMediaDTO) => {
        try {
            const updated = await api.updateShow(id, showData);
            setShows((prev) => prev.map((s) => (s._id === id ? updated : s)));
            return updated;
        } catch (err) {
            console.error(err);
            throw new Error('Não foi possível atualizar a série.');
        }
    };

    // Função para remover série
    const removeShow = async (id: string) => {
        try {
            await api.deleteShow(id);
            setShows((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error(err);
            throw new Error('Não foi possível remover a série.');
        }
    };

    return {
        shows,
        loading,
        error,
        refreshShows: fetchShows,
        addShow,
        editShow,
        removeShow
    };
}
