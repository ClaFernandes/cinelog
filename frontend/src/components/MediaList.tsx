import type { MediaItem } from '../types';
import MediaCard from './MediaCard';
import './MediaList.css';

interface MediaListProps {
    items: MediaItem[];
}

function MediaList({ items }: MediaListProps) {
    if (items.length === 0) {
        return (
            <div className="media-list-empty">
                <p>Nenhum título encontrado.</p>
            </div>
        );
    }

    return (
        <div className="media-list-grid">
            {items.map((item) => (
                <MediaCard key={`${item.kind}-${item._id}`} item={item} />
            ))}
        </div>
    );
}

export default MediaList;
