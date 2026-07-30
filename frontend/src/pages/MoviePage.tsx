import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MediaForm from '../components/MediaForm';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Movie, MovieDetails, MovieStatus, CreateMovieDTO, CreateShowDTO, SimilarMedia } from '../types';
import * as api from '../services/api';
import './MoviePage.css';

const STATUS_OPTIONS: { value: MovieStatus; label: string }[] = [
    { value: 'to_watch', label: 'quero ver' },
    { value: 'watching', label: 'assistindo' },
    { value: 'watched', label: 'assistido' },
];

function MoviePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loadingMovie, setLoadingMovie] = useState(true);
    const [movieError, setMovieError] = useState<string | null>(null);

    const [details, setDetails] = useState<MovieDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);

    const [reviewDraft, setReviewDraft] = useState('');
    const [savingReview, setSavingReview] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);

    const [mediaToAdd, setMediaToAdd] = useState<SimilarMedia | null>(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoadingMovie(true);
        api
            .getMovieById(id)
            .then((data) => {
                setMovie(data);
                setReviewDraft(data.review ?? '');
                setIsEditingReview(!data.review);
            })
            .catch((err) => {
                console.error(err);
                setMovieError('Filme não encontrado.');
            })
            .finally(() => setLoadingMovie(false));
    }, [id]);

    useEffect(() => {
        if (!movie) return;

        setLoadingDetails(true);
        api
            .getMovieDetails(movie.tmdbId)
            .then(setDetails)
            .catch((err) => console.error(err))
            .finally(() => setLoadingDetails(false));
    }, [movie?.tmdbId]);

    const handleStatusChange = async (status: MovieStatus) => {
        if (!id || !movie) return;
        const updated = await api.updateMovie(id, { status });
        setMovie(updated);
    };

    const handleRatingChange = async (rating: number) => {
        if (!id || !movie) return;
        const updated = await api.updateMovie(id, { rating });
        setMovie(updated);
    };

    const handleSaveReview = async () => {
        if (!id) return;
        try {
            setSavingReview(true);
            const updated = await api.updateMovie(id, { review: reviewDraft });
            setMovie(updated);
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
        await api.deleteMovie(id);
        navigate('/');
    };

    const handleAddSimilarMedia = async (data: CreateMovieDTO | CreateShowDTO) => {
        await api.createMovie(data as CreateMovieDTO);
    };

    if (loadingMovie) {
        return (
            <>
                <Header variant="detail" />
                <p className="movie-page-status-message">Carregando filme...</p>
                <Footer />
            </>
        );
    }

    if (movieError || !movie) {
        return (
            <>
                <Header variant="detail" />
                <div className="movie-page-status-message">
                    <p>{movieError ?? 'Filme não encontrado.'}</p>
                    <Link to="/">Voltar para a Home</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header variant="detail" />

            <div className="movie-page-hero">
                <div className="movie-page-hero-content">
                    <img
                        src={movie.posterUrl || 'https://placehold.co/200x300?text=Sem+Capa'}
                        alt={movie.title}
                        className="movie-page-poster"
                    />

                    <div className="movie-page-info">
                        <div className="movie-page-title-row">
                            <span className="movie-page-title">{movie.title}</span>
                            <span className="movie-page-year">({movie.year})</span>
                        </div>

                        <div className="movie-page-genre-row">
                            {movie.genre.map((g) => (
                                <span key={g} className="movie-page-genre-chip">{g}</span>
                            ))}
                        </div>

                        <div className="movie-page-control-bar">
                            <div className="movie-page-control-group">
                                <label>Status</label>
                                <div className="movie-page-status-pills">
                                    {STATUS_OPTIONS.map((option) => (
                                        <span
                                            key={option.value}
                                            className={`movie-page-status-pill ${movie.status === option.value ? 'selected' : ''}`}
                                            onClick={() => handleStatusChange(option.value)}
                                        >
                                            {option.label}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="movie-page-control-group">
                                <label>Sua nota</label>
                                <div className="movie-page-rating-edit">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= (movie.rating ?? 0) ? 'filled' : ''}
                                            onClick={() => handleRatingChange(star)}
                                        >
                                            {star <= (movie.rating ?? 0) ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="movie-page-body-grid">
                <div>
                    <section>
                        <h3 className="movie-page-section-title">Trailer</h3>
                        {details?.trailerKey ? (
                            <div className="movie-page-trailer-box">
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
                            <div className="movie-page-trailer-box movie-page-trailer-empty">
                                {loadingDetails ? 'Carregando trailer...' : 'Trailer não disponível.'}
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="movie-page-section-title">Sinopse</h3>
                        <p className="movie-page-synopsis">
                            {loadingDetails ? 'Carregando sinopse...' : (details?.overview || 'Sinopse não disponível.')}
                        </p>
                    </section>

                    <section>
                        <h3 className="movie-page-section-title">Elenco</h3>
                        <div className="movie-page-cast-scroll">
                            {details?.cast.map((member) => (
                                <div key={member.name} className="movie-page-cast-item">
                                    <img
                                        src={member.photoUrl || 'https://placehold.co/88x88?text=?'}
                                        alt={member.name}
                                        className="movie-page-cast-photo"
                                    />
                                    <div className="movie-page-cast-name">{member.name}</div>
                                    <div className="movie-page-cast-role">{member.character}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="movie-page-section-title">Sua resenha</h3>

                        {isEditingReview ? (
                            <div className="movie-page-review-box">
                                <textarea
                                    placeholder="Escreva sua resenha pessoal sobre o filme..."
                                    value={reviewDraft}
                                    onChange={(e) => setReviewDraft(e.target.value)}
                                />
                                <div className="movie-page-review-actions">
                                    <button
                                        className="movie-page-save-btn"
                                        onClick={handleSaveReview}
                                        disabled={savingReview}
                                    >
                                        {savingReview ? 'Salvando...' : (movie.review ? 'Salvar' : 'Publicar resenha')}
                                    </button>

                                    {movie.review && (
                                        <button
                                            className="movie-page-cancel-review-btn"
                                            onClick={() => {
                                                setReviewDraft(movie.review ?? '');
                                                setIsEditingReview(false);
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="movie-page-review-display">
                                <p className="movie-page-review-text">{movie.review}</p>
                                <button
                                    className="movie-page-edit-review-btn"
                                    onClick={() => setIsEditingReview(true)}
                                >
                                    <Pencil size={14} /> Editar
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                <aside>
                    <div className="movie-page-sidebar-card">
                        <h3 className="movie-page-section-title">Detalhes</h3>
                        <div className="movie-page-meta-row"><span>Ano</span><span>{movie.year}</span></div>
                        <div className="movie-page-meta-row"><span>Gêneros</span><span>{movie.genre.join(', ')}</span></div>
                        <div className="movie-page-meta-row">
                            <span>Adicionado em</span>
                            <span>{new Date(movie.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="movie-page-meta-row"><span>TMDB ID</span><span>#{movie.tmdbId}</span></div>
                    </div>

                    <div className="movie-page-sidebar-card">
                        <span className="movie-page-danger-link" onClick={handleRemove}>
                            Remover da minha lista
                        </span>
                    </div>
                </aside>
            </div>

            {details && details.similar.length > 0 && (
                <div className="movie-page-similar-section">
                    <h3 className="movie-page-section-title">Filmes semelhantes</h3>
                    <div className="movie-page-similar-scroll">
                        {details.similar.map((similar) => (
                            <div
                                key={similar.tmdbId}
                                className="movie-page-similar-card"
                                onClick={() => setMediaToAdd(similar)}
                            >
                                <img
                                    src={similar.posterUrl || 'https://placehold.co/150x225?text=Sem+Capa'}
                                    alt={similar.title}
                                    className="movie-page-similar-poster"
                                />
                                <div className="movie-page-similar-title">{similar.title}</div>
                                <div className="movie-page-similar-meta">
                                    {similar.year} · {similar.genre[0] ?? ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mediaToAdd && (
                <MediaForm
                    initialItem={{ result: mediaToAdd, kind: 'movie' }}
                    onSubmit={handleAddSimilarMedia}
                    onClose={() => setMediaToAdd(null)}
                />
            )}

            {showRemoveConfirm && (
                <ConfirmDialog
                    title="Remover filme"
                    message={`Tem certeza que deseja remover "${movie.title}" da sua coleção?`}
                    confirmLabel="Remover"
                    onConfirm={confirmRemove}
                    onCancel={() => setShowRemoveConfirm(false)}
                />
            )}

            <Footer />
        </>
    );
}

export default MoviePage;
