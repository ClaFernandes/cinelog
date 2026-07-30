import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MediaForm from '../components/MediaForm';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Show, ShowDetails, MovieStatus, CreateMovieDTO, CreateShowDTO, SimilarMedia, AirStatus } from '../types';
import * as api from '../services/api';
import './ShowPage.css';

const STATUS_OPTIONS: { value: MovieStatus; label: string }[] = [
    { value: 'to_watch', label: 'quero ver' },
    { value: 'watching', label: 'assistindo' },
    { value: 'watched', label: 'assistido' },
];

// Traduz o status de exibição 
const AIR_STATUS_LABELS: Record<AirStatus, string> = {
    returning: 'Em exibição',
    ended: 'Encerrada',
    canceled: 'Cancelada',
};

function ShowPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [show, setShow] = useState<Show | null>(null);
    const [loadingShow, setLoadingShow] = useState(true);
    const [showError, setShowError] = useState<string | null>(null);

    const [details, setDetails] = useState<ShowDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

    const [reviewDraft, setReviewDraft] = useState('');
    const [savingReview, setSavingReview] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);

    const [mediaToAdd, setMediaToAdd] = useState<SimilarMedia | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoadingShow(true);
        api
            .getShowById(id)
            .then((data) => {
                setShow(data);
                setReviewDraft(data.review ?? '');
                setIsEditingReview(!data.review);
            })
            .catch((err) => {
                console.error(err);
                setShowError('Série não encontrada.');
            })
            .finally(() => setLoadingShow(false));
    }, [id]);

    useEffect(() => {
        if (!show) return;

        setLoadingDetails(true);
        api
            .getShowDetails(show.tmdbId)
            .then(setDetails)
            .catch((err) => console.error(err))
            .finally(() => setLoadingDetails(false));
    }, [show?.tmdbId]);

    const handleStatusChange = async (status: MovieStatus) => {
        if (!id || !show) return;
        const updated = await api.updateShow(id, { status });
        setShow(updated);
    };

    const handleRatingChange = async (rating: number) => {
        if (!id || !show) return;
        const updated = await api.updateShow(id, { rating });
        setShow(updated);
    };

    const handleSaveReview = async () => {
        if (!id) return;
        try {
            setSavingReview(true);
            const updated = await api.updateShow(id, { review: reviewDraft });
            setShow(updated);
            setIsEditingReview(false);
        } finally {
            setSavingReview(false);
        }
    };

    const handleRemove = () => {
        setShowRemoveConfirm(true);
    };

    const confirmRemove = async () => {
        if (!id) return;
        await api.deleteShow(id);
        navigate('/');
    };

    // Recomendações de uma SÉRIE na TMDB são sempre outras séries
    const handleAddSimilarMedia = async (data: CreateMovieDTO | CreateShowDTO) => {
        await api.createShow(data as CreateShowDTO);
    };

    if (loadingShow) {
        return (
            <>
                <Header variant="detail" />
                <p className="show-page-status-message">Carregando série...</p>
                <Footer />
            </>
        );
    }

    if (showError || !show) {
        return (
            <>
                <Header variant="detail" />
                <div className="show-page-status-message">
                    <p>{showError ?? 'Série não encontrada.'}</p>
                    <Link to="/">Voltar para a Home</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header variant="detail" />

            <div className="show-page-hero">
                <div className="show-page-hero-content">
                    <img
                        src={show.posterUrl || 'https://placehold.co/200x300?text=Sem+Capa'}
                        alt={show.title}
                        className="show-page-poster"
                    />

                    <div className="show-page-info">
                        <div className="show-page-title-row">
                            <span className="show-page-title">{show.title}</span>
                            <span className="show-page-year">({show.year})</span>
                        </div>

                        <div className="show-page-genre-row">
                            {show.genre.map((g) => (
                                <span key={g} className="show-page-genre-chip">{g}</span>
                            ))}
                        </div>

                        <div className="show-page-control-bar">
                            <div className="show-page-control-group">
                                <label>Status</label>
                                <div className="show-page-status-pills">
                                    {STATUS_OPTIONS.map((option) => (
                                        <span
                                            key={option.value}
                                            className={`show-page-status-pill ${show.status === option.value ? 'selected' : ''}`}
                                            onClick={() => handleStatusChange(option.value)}
                                        >
                                            {option.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="show-page-control-group">
                                <label>Sua nota</label>
                                <div className="show-page-rating-edit">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= (show.rating ?? 0) ? 'filled' : ''}
                                            onClick={() => handleRatingChange(star)}
                                        >
                                            {star <= (show.rating ?? 0) ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="show-page-body-grid">
                <div>
                    <section>
                        <h3 className="show-page-section-title">Trailer</h3>
                        {details?.trailerKey ? (
                            <div className="show-page-trailer-box">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${details.trailerKey}`}
                                    title="Trailer"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="show-page-trailer-box show-page-trailer-empty">
                                {loadingDetails ? 'Carregando trailer...' : 'Trailer não disponível.'}
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="show-page-section-title">Sinopse</h3>
                        <p className="show-page-synopsis">
                            {loadingDetails ? 'Carregando sinopse...' : (details?.overview || 'Sinopse não disponível.')}
                        </p>
                    </section>

                    <section>
                        <h3 className="show-page-section-title">Elenco</h3>
                        <div className="show-page-cast-scroll">
                            {details?.cast.map((member) => (
                                <div key={member.name} className="show-page-cast-item">
                                    <img
                                        src={member.photoUrl || 'https://placehold.co/88x88?text=?'}
                                        alt={member.name}
                                        className="show-page-cast-photo"
                                    />
                                    <div className="show-page-cast-name">{member.name}</div>
                                    <div className="show-page-cast-role">{member.character}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="show-page-section-title">Sua resenha</h3>

                        {isEditingReview ? (
                            <div className="show-page-review-box">
                                <textarea
                                    placeholder="Escreva sua resenha pessoal sobre a série..."
                                    value={reviewDraft}
                                    onChange={(e) => setReviewDraft(e.target.value)}
                                />
                                <div className="show-page-review-actions">
                                    <button
                                        className="show-page-save-btn"
                                        onClick={handleSaveReview}
                                        disabled={savingReview}
                                    >
                                        {savingReview ? 'Salvando...' : (show.review ? 'Salvar' : 'Publicar resenha')}
                                    </button>

                                    {show.review && (
                                        <button
                                            className="show-page-cancel-review-btn"
                                            onClick={() => {
                                                setReviewDraft(show.review ?? '');
                                                setIsEditingReview(false);
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="show-page-review-display">
                                <p className="show-page-review-text">{show.review}</p>
                                <button
                                    className="show-page-edit-review-btn"
                                    onClick={() => setIsEditingReview(true)}
                                >
                                    <Pencil size={14} /> Editar
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                <aside>
                    <div className="show-page-sidebar-card">
                        <h3 className="show-page-section-title">Detalhes</h3>
                        <div className="show-page-meta-row"><span>Ano</span><span>{show.year}</span></div>
                        <div className="show-page-meta-row"><span>Gêneros</span><span>{show.genre.join(', ')}</span></div>
                        {details && (
                            <>
                                <div className="show-page-meta-row">
                                    <span>Temporadas</span>
                                    <span>{details.numberOfSeasons}</span>
                                </div>
                                <div className="show-page-meta-row">
                                    <span>Episódios</span>
                                    <span>{details.numberOfEpisodes}</span>
                                </div>
                                <div className="show-page-meta-row">
                                    <span>Situação</span>
                                    <span>{AIR_STATUS_LABELS[details.airStatus]}</span>
                                </div>
                            </>
                        )}
                        <div className="show-page-meta-row">
                            <span>Adicionado em</span>
                            <span>{new Date(show.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="show-page-meta-row"><span>TMDB ID</span><span>#{show.tmdbId}</span></div>
                    </div>

                    <div className="show-page-sidebar-card">
                        <span className="show-page-danger-link" onClick={handleRemove}>
                            Remover da minha lista
                        </span>
                    </div>
                </aside>
            </div>

            {details && details.similar.length > 0 && (
                <div className="show-page-similar-section">
                    <h3 className="show-page-section-title">Séries semelhantes</h3>
                    <div className="show-page-similar-scroll">
                        {details.similar.map((similar) => (
                            <div
                                key={similar.tmdbId}
                                className="show-page-similar-card"
                                onClick={() => setMediaToAdd(similar)}
                            >
                                <img
                                    src={similar.posterUrl || 'https://placehold.co/150x225?text=Sem+Capa'}
                                    alt={similar.title}
                                    className="show-page-similar-poster"
                                />
                                <div className="show-page-similar-title">{similar.title}</div>
                                <div className="show-page-similar-meta">
                                    {similar.year} · {similar.genre[0] ?? ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mediaToAdd && (
                <MediaForm
                    initialItem={{ result: mediaToAdd, kind: 'show' }}
                    onSubmit={handleAddSimilarMedia}
                    onClose={() => setMediaToAdd(null)}
                />
            )}

            {showRemoveConfirm && (
                <ConfirmDialog
                    title="Remover série"
                    message={`Tem certeza que deseja remover "${show.title}" da sua coleção?`}
                    confirmLabel="Remover"
                    onConfirm={confirmRemove}
                    onCancel={() => setShowRemoveConfirm(false)}
                />
            )}

            <Footer />
        </>
    );
}

export default ShowPage;
