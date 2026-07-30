import { useMemo } from 'react';
import type { MediaItem } from '../types';
import './GenreFilter.css';

interface GenreFilterProps {
    items: MediaItem[];
    selected: string; // 'all' ou o nome exato do gênero
    onChange: (genre: string) => void;
}

function GenreFilter({ items, selected, onChange }: GenreFilterProps) {
    // Monta a lista de gêneros disponíveis a partir dos próprios itens da coleção 
    const genres = useMemo(() => {
        const set = new Set<string>();
        items.forEach((item) => item.genre.forEach((g) => set.add(g)));
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [items]);

    if (genres.length === 0) return null;

    return (
        <div className="genre-filter-block">
            <h4>Gênero</h4>
            <select
                className="genre-filter-select"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="all">Todos os gêneros</option>
                {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                ))}
            </select>
        </div>
    );
}

export default GenreFilter;