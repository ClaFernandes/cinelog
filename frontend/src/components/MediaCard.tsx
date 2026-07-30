import { useNavigate } from 'react-router-dom';
import { Film, Tv } from 'lucide-react';
import type { MediaItem } from '../types';
import './MediaCard.css';

interface MediaCardProps {
    item: MediaItem;
}

const STATUS_LABELS: Record<MediaItem['status'], string> = {
    to_watch: 'quero ver',
    watching: 'assistindo',
    watched: 'assistido',
};

function renderStars(rating?: number): string {
    if (!rating) return '—';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function MediaCard({ item }: MediaCardProps) {
    const navigate = useNavigate();

    const detailPath = item.kind === 'movie' ? `/movies/${item._id}` : `/shows/${item._id}`;

    return (
        <div className="media-card" onClick={() => navigate(detailPath)}>
            <div className="media-card-poster-wrap">
                <span className={`media-card-badge ${item.status}`}>
                    {STATUS_LABELS[item.status]}
                </span>
                <span className="media-card-kind-icon" title={item.kind === 'movie' ? 'Filme' : 'Série'}>
                    {item.kind === 'movie' ? <Film size={13} /> : <Tv size={13} />}
                </span>
                <img
                    src={item.posterUrl || 'https://placehold.co/170x255?text=Sem+Capa'}
                    alt={item.title}
                    className="media-card-poster"
                />
            </div>

            <div className="media-card-body">
                <div className="media-card-title">{item.title}</div>
                <div className="media-card-meta">
                    <span>{item.year}</span>
                    <span className="media-card-stars">{renderStars(item.rating)}</span>
                </div>
            </div>
        </div>
    );
}

export default MediaCard;
