import { useState, useEffect } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import type { TmdbSearchResult } from '../types';
import { searchTmdbMovies } from '../services/api';
import './TmdbSearch.css';

interface TmdbSearchProps {
    onSelectMovie: (movie: TmdbSearchResult) => void;
}

export default function TmdbSearch({ onSelectMovie }: TmdbSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TmdbSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Evita chamadas com texto muito curto
        if (!query.trim() || query.length < 2) {
            setResults([]);
            return;
        }

        // Aguarda 400ms após o usuário parar de digitar antes de buscar
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await searchTmdbMovies(query);
                setResults(data);
            } catch (err) {
                console.error(err);
                setError('Erro ao buscar filmes no TMDB.');
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="tmdb-search-container">
            <div className="tmdb-search-input-wrapper">
                <Search size={18} className="tmdb-search-icon" />
                <input
                    type="text"
                    placeholder="Digite o nome de um filme (ex: Batman, Matrix)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && <Loader2 size={18} className="tmdb-search-spinner" />}
            </div>

            {error && <p className="tmdb-search-error">{error}</p>}

            {results.length > 0 && (
                <ul className="tmdb-search-results">
                    {results.map((movie) => (
                        <li key={movie.tmdbId} className="tmdb-search-item">
                            <img
                                src={movie.posterUrl || 'https://placehold.co/45x68?text=Sem+Capa'}
                                alt={movie.title}
                                className="tmdb-search-poster"
                            />
                            <div className="tmdb-search-info">
                                <strong>{movie.title}</strong>
                                <span>{movie.year ? movie.year : 'Ano desconhecido'}</span>
                            </div>
                            <button
                                type="button"
                                className="tmdb-search-select-btn"
                                onClick={() => {
                                    onSelectMovie(movie);
                                    setQuery('');
                                    setResults([]);
                                }}
                            >
                                <Plus size={16} /> Select
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
