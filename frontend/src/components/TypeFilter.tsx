import type { MediaItem } from '../types';
import './TypeFilter.css';

export type TypeFilterValue = 'all' | 'movie' | 'show';

interface TypeFilterProps {
    items: MediaItem[];
    selected: TypeFilterValue;
    onChange: (value: TypeFilterValue) => void;
}

const OPTIONS: { value: TypeFilterValue; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'movie', label: 'Filmes' },
    { value: 'show', label: 'Séries' },
];

// Mesmo padrão do StatusFilter
function TypeFilter({ items, selected, onChange }: TypeFilterProps) {
    const countFor = (value: TypeFilterValue): number => {
        if (value === 'all') return items.length;
        return items.filter((item) => item.kind === value).length;
    };

    return (
        <div className="type-filter-block">
            <h4>Tipo</h4>
            <div className="type-filter-list">
                {OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        className={`type-filter-item ${selected === option.value ? 'active' : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        <span>{option.label}</span>
                        <span className="type-filter-count">{countFor(option.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TypeFilter;