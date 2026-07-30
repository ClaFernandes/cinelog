import type { MediaItem, MovieStatus } from '../types';
import './StatusFilter.css';

// 'all' representa "nenhum filtro aplicado" 
export type StatusFilterValue = MovieStatus | 'all';

interface StatusFilterProps {
    items: MediaItem[];
    selected: StatusFilterValue;
    onChange: (status: StatusFilterValue) => void;
}

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'to_watch', label: 'Quero ver' },
    { value: 'watching', label: 'Assistindo' },
    { value: 'watched', label: 'Assistido' },
];

function StatusFilter({ items, selected, onChange }: StatusFilterProps) {
    const countFor = (value: StatusFilterValue): number => {
        if (value === 'all') return items.length;
        return items.filter((item) => item.status === value).length;
    };

    return (
        <div className="status-filter-block">
            <h4>Status</h4>
            <div className="status-filter-list">
                {OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        className={`status-filter-item ${selected === option.value ? 'active' : ''}`}
                        onClick={() => onChange(option.value)}
                    >
                        <span>{option.label}</span>
                        <span className="status-filter-count">{countFor(option.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatusFilter;
