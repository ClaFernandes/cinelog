import { useState } from 'react';
import type { CreateMovieDTO, CreateShowDTO, MovieStatus, MediaSearchResult } from '../types';
import TmdbSearch from './TmdbSearch';
import './MediaForm.css';

type MediaKind = 'movie' | 'show';

interface MediaFormProps {
    onSubmit: (data: CreateMovieDTO | CreateShowDTO, kind: MediaKind) => Promise<void>;
    onClose: () => void;
    initialItem?: { result: MediaSearchResult; kind: MediaKind };
}

const STATUS_OPTIONS: { value: MovieStatus; label: string }[] = [
    { value: 'to_watch', label: 'quero ver' },
    { value: 'watching', label: 'assistindo' },
    { value: 'watched', label: 'assistido' },
];

function MediaForm({ onSubmit, onClose, initialItem }: MediaFormProps) {
    const [selected, setSelected] = useState<MediaSearchResult | null>(initialItem?.result ?? null);
    const [kind, setKind] = useState<MediaKind>(initialItem?.kind ?? 'movie');
    const [status, setStatus] = useState<MovieStatus>('to_watch');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectMedia = (result: MediaSearchResult, selectedKind: MediaKind) => {
        setSelected(result);
        setKind(selectedKind);
    };

    const handleSubmit = async () => {
        if (!selected) return;

        const data: CreateMovieDTO | CreateShowDTO = {
            tmdbId: selected.tmdbId,
            title: selected.title,
            year: selected.year,
            genre: selected.genre,
            posterUrl: selected.posterUrl,
            status,
        };

        try {
            setSaving(true);
            setError(null);
            await onSubmit(data, kind);
            onClose();
        } catch (err) {
            console.error(err);
            setError(`Não foi possível salvar ${kind === 'movie' ? 'o filme' : 'a série'}. Tente novamente.`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="media-form-overlay" onClick={onClose}>
            <div className="media-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="media-form-header">
                    <h2>Adicionar {kind === 'movie' ? 'filme' : 'série'}</h2>
                    <button className="media-form-close" onClick={onClose}>✕</button>
                </div>

                {!selected ? (
                    <TmdbSearch onSelectMedia={handleSelectMedia} />
                ) : (
                    <div className="media-form-selected">
                        <img
                            src={selected.posterUrl || 'https://placehold.co/80x120?text=Sem+Capa'}
                            alt={selected.title}
                            className="media-form-poster"
                        />
                        <div className="media-form-selected-info">
                            <strong>{selected.title}</strong>
                            <span>{selected.year} · {kind === 'movie' ? 'Filme' : 'Série'}</span>
                            <button
                                type="button"
                                className="media-form-change-btn"
                                onClick={() => setSelected(null)}
                            >
                                Trocar
                            </button>
                        </div>
                    </div>
                )}

                {selected && (
                    <>
                        <div className="media-form-status-group">
                            <label>Status</label>
                            <div className="media-form-status-pills">
                                {STATUS_OPTIONS.map((option) => (
                                    <span
                                        key={option.value}
                                        className={`media-form-status-pill ${status === option.value ? 'selected' : ''}`}
                                        onClick={() => setStatus(option.value)}
                                    >
                                        {option.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {error && <p className="media-form-error">{error}</p>}

                        <button className="media-form-submit" onClick={handleSubmit} disabled={saving}>
                            {saving ? 'Salvando...' : `Adicionar à coleção`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default MediaForm;
