import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types';
import './MovieCard.css';

interface MovieCardProps {
    movie: Movie;
}

// Mapeia o valor cru do status para o texto em português que aparece no badge
const STATUS_LABELS: Record<Movie['status'], string> = {
    to_watch: 'quero ver',
    watching: 'assistindo',
    watched: 'assistido',
};

// Monta a string de estrelas a partir da nota
function renderStars(rating?: number): string {
    if (!rating) return '—';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function MovieCard({ movie }: MovieCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="movie-card"
            onClick={() => navigate(`/movies/${movie._id}`)}
        >
            <div className="movie-card-poster-wrap">
                <span className={`movie-card-badge ${movie.status}`}>
                    {STATUS_LABELS[movie.status]}
                </span>
                <img
                    src={movie.posterUrl || 'https://placehold.co/170x255?text=Sem+Capa'}
                    alt={movie.title}
                    className="movie-card-poster"
                />
            </div>

            <div className="movie-card-body">
                <div className="movie-card-title">{movie.title}</div>
                <div className="movie-card-meta">
                    <span>{movie.year}</span>
                    <span className="movie-card-stars">{renderStars(movie.rating)}</span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
