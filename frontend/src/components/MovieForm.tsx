import { useState } from 'react';
import type { CreateMovieDTO, MovieStatus, TmdbSearchResult } from '../types';
import TmdbSearch from './TmdbSearch';
import './MovieForm.css';

interface MovieFormProps {
    onSubmit: (movieData: CreateMovieDTO) => Promise<void>;
    onClose: () => void;
    initialMovie?: TmdbSearchResult;
}

const STATUS_OPTIONS: { value: MovieStatus; label: string }[] = [
    { value: 'to_watch', label: 'quero ver' },
    { value: 'watching', label: 'assistindo' },
    { value: 'watched', label: 'assistido' },
];

function MovieForm({ onSubmit, onClose, initialMovie }: MovieFormProps) {
    // Se vier um initialMovie, o form já nasce com o filme selecionado
    const [selectedMovie, setSelectedMovie] = useState<TmdbSearchResult | null>(initialMovie ?? null);
    const [status, setStatus] = useState<MovieStatus>('to_watch');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!selectedMovie) return;

        // Não inclui rating nem review aqui 
        const movieData: CreateMovieDTO = {
            tmdbId: selectedMovie.tmdbId,
            title: selectedMovie.title,
            year: selectedMovie.year,
            genre: selectedMovie.genre,
            posterUrl: selectedMovie.posterUrl,
            status,
        };

        try {
            setSaving(true);
            setError(null);
            await onSubmit(movieData);
            onClose(); // só fecha o modal se salvar com sucesso
        } catch (err) {
            console.error(err);
            setError('Não foi possível salvar o filme. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return (
        // Clicar fora do modal (no overlay escuro) fecha ele
        <div className="movie-form-overlay" onClick={onClose}>
            {/* stopPropagation impede que um clique no modal feche-o sem querer */}
            <div className="movie-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="movie-form-header">
                    <h2>Adicionar filme</h2>
                    <button className="movie-form-close" onClick={onClose}>✕</button>
                </div>

                {!selectedMovie ? (
                    <TmdbSearch onSelectMovie={setSelectedMovie} />
                ) : (
                    <div className="movie-form-selected">
                        <img
                            src={selectedMovie.posterUrl || 'https://placehold.co/80x120?text=Sem+Capa'}
                            alt={selectedMovie.title}
                            className="movie-form-poster"
                        />
                        <div className="movie-form-selected-info">
                            <strong>{selectedMovie.title}</strong>
                            <span>{selectedMovie.year}</span>
                            <button
                                type="button"
                                className="movie-form-change-btn"
                                onClick={() => setSelectedMovie(null)}
                            >
                                Trocar filme
                            </button>
                        </div>
                    </div>
                )}

                {selectedMovie && (
                    <>
                        <div className="movie-form-status-group">
                            <label>Status</label>
                            <div className="movie-form-status-pills">
                                {STATUS_OPTIONS.map((option) => (
                                    <span
                                        key={option.value}
                                        className={`movie-form-status-pill ${status === option.value ? 'selected' : ''}`}
                                        onClick={() => setStatus(option.value)}
                                    >
                                        {option.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {error && <p className="movie-form-error">{error}</p>}

                        <button
                            className="movie-form-submit"
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving ? 'Salvando...' : 'Adicionar à coleção'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default MovieForm;
