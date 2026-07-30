import { useState, useEffect } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import type { MediaSearchResult } from '../types';
import { searchTmdbMovies, searchTmdbShows } from '../services/api';
import './TmdbSearch.css';

type MediaKind = 'movie' | 'show';

interface TmdbSearchProps {
    onSelectMedia: (result: MediaSearchResult, kind: MediaKind) => void;
}

export default function TmdbSearch({ onSelectMedia }: TmdbSearchProps) {
    const [kind, setKind] = useState<MediaKind>('movie');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MediaSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                // busca no endpoint certo conforme o toggle Filme/Série
                const data = kind === 'movie'
                    ? await searchTmdbMovies(query)
                    : await searchTmdbShows(query);
                setResults(data);
            } catch (err) {
                console.error(err);
                setError('Erro ao buscar na TMDB.');
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, kind]);

    const handleKindChange = (newKind: MediaKind) => {
        setKind(newKind);
        setResults([]);
    };

    return (
        <div className="tmdb-search-container">
            <div className="tmdb-search-kind-toggle">
                <button
                    type="button"
                    className={kind === 'movie' ? 'active' : ''}
                    onClick={() => handleKindChange('movie')}
                >
                    Filme
                </button>
                <button
                    type="button"
                    className={kind === 'show' ? 'active' : ''}
                    onClick={() => handleKindChange('show')}
                >
                    Série
                </button>
            </div>

            <div className="tmdb-search-input-wrapper">
                <Search size={18} className="tmdb-search-icon" />
                <input
                    type="text"
                    placeholder={kind === 'movie' ? 'Digite o nome de um filme...' : 'Digite o nome de uma série...'}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && <Loader2 size={18} className="tmdb-search-spinner" />}
            </div>

            {error && <p className="tmdb-search-error">{error}</p>}

            {results.length > 0 && (
                <ul className="tmdb-search-results">
                    {results.map((item) => (
                        <li key={item.tmdbId} className="tmdb-search-item">
                            <img
                                src={item.posterUrl || 'https://placehold.co/45x68?text=Sem+Capa'}
                                alt={item.title}
                                className="tmdb-search-poster"
                            />
                            <div className="tmdb-search-info">
                                <strong>{item.title}</strong>
                                <span>{item.year ? item.year : 'Ano desconhecido'}</span>
                            </div>
                            <button
                                type="button"
                                className="tmdb-search-select-btn"
                                onClick={() => {
                                    onSelectMedia(item, kind);
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
