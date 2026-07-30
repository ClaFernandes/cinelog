import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StatusFilter, { type StatusFilterValue } from '../components/StatusFilter';
import TypeFilter, { type TypeFilterValue } from '../components/TypeFilter';
import GenreFilter from '../components/GenreFilter';
import MediaList from '../components/MediaList';
import MediaForm from '../components/MediaForm';
import { useMovies } from '../hooks/useMovies';
import { useShows } from '../hooks/useShows';
import type { MediaItem, CreateMovieDTO, CreateShowDTO } from '../types';
import './HomePage.css';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type SortValue = 'recent' | 'title-asc' | 'title-desc' | 'year' | 'rating';

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
    { value: 'recent', label: 'Adicionado recentemente' },
    { value: 'title-asc', label: 'Título (A–Z)' },
    { value: 'title-desc', label: 'Título (Z–A)' },
    { value: 'year', label: 'Ano de lançamento' },
    { value: 'rating', label: 'Melhor avaliados' },
];

function HomePage() {
    const navigate = useNavigate();
    const { movies, loading: loadingMovies, error: moviesError, addMovie } = useMovies();
    const { shows, loading: loadingShows, error: showsError, addShow } = useShows();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
    const [typeFilter, setTypeFilter] = useState<TypeFilterValue>('all');
    const [genreFilter, setGenreFilter] = useState('all');
    const [sortBy, setSortBy] = useState<SortValue>('recent');
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const allItems = useMemo<MediaItem[]>(() => {
        const movieItems: MediaItem[] = movies.map((m) => ({ ...m, kind: 'movie' as const }));
        const showItems: MediaItem[] = shows.map((s) => ({ ...s, kind: 'show' as const }));
        return [...movieItems, ...showItems];
    }, [movies, shows]);

    const loading = loadingMovies || loadingShows;
    const error = moviesError || showsError;

    // Filtra por status, tipo, gênero e texto de busca — nessa ordem, mas
    // como são todos "AND" entre si, a ordem de avaliação não importa pro
    // resultado final, só pra legibilidade do código
    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return allItems.filter((item) => {
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            const matchesType = typeFilter === 'all' || item.kind === typeFilter;
            const matchesGenre = genreFilter === 'all' || item.genre.includes(genreFilter);
            const matchesSearch =
                query === '' ||
                item.title.toLowerCase().includes(query) ||
                item.genre.some((g) => g.toLowerCase().includes(query));

            return matchesStatus && matchesType && matchesGenre && matchesSearch;
        });
    }, [allItems, statusFilter, typeFilter, genreFilter, searchQuery]);

    // A ordenação roda DEPOIS do filtro, sobre o resultado já filtrado —
    // ordenar tudo antes seria trabalho desperdiçado em itens que nem vão aparecer
    const sortedItems = useMemo(() => {
        const items = [...filteredItems];

        switch (sortBy) {
            case 'title-asc':
                return items.sort((a, b) => a.title.localeCompare(b.title));
            case 'title-desc':
                return items.sort((a, b) => b.title.localeCompare(a.title));
            case 'year':
                return items.sort((a, b) => b.year - a.year);
            case 'rating':
                // itens sem nota (rating undefined) vão pro final da lista
                return items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
            case 'recent':
            default:
                return items.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
        }
    }, [filteredItems, sortBy]);

    const watchingNow = useMemo(
        () => allItems.filter((item) => item.status === 'watching'),
        [allItems]
    );

    const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const paginatedItems = sortedItems.slice(pageStart, pageStart + pageSize);

    // Todo filtro/ordenação/busca nova volta pra página 1 — senão o usuário
    // pode ficar "preso" numa página que não existe mais no resultado novo
    const resetToFirstPage = () => setCurrentPage(1);

    const handleStatusChange = (value: StatusFilterValue) => {
        setStatusFilter(value);
        resetToFirstPage();
    };

    const handleTypeChange = (value: TypeFilterValue) => {
        setTypeFilter(value);
        resetToFirstPage();
    };

    const handleGenreChange = (value: string) => {
        setGenreFilter(value);
        resetToFirstPage();
    };

    const handleSortChange = (value: SortValue) => {
        setSortBy(value);
        resetToFirstPage();
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        resetToFirstPage();
    };

    const handleAddMedia = async (data: CreateMovieDTO | CreateShowDTO, kind: 'movie' | 'show') => {
        if (kind === 'movie') {
            await addMovie(data as CreateMovieDTO);
        } else {
            await addShow(data as CreateShowDTO);
        }
    };

    return (
        <div className="home-page-wrapper">
            <Header
                variant="home"
                onAddClick={() => setShowForm(true)}
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
            />

            <div className="home-page">
                <aside className="home-sidebar">
                    <StatusFilter
                        items={allItems}
                        selected={statusFilter}
                        onChange={handleStatusChange}
                    />
                    <TypeFilter
                        items={allItems}
                        selected={typeFilter}
                        onChange={handleTypeChange}
                    />
                    <GenreFilter
                        items={allItems}
                        selected={genreFilter}
                        onChange={handleGenreChange}
                    />
                    <div className="home-sort-block">
                        <h4>Ordenar por</h4>
                        <select
                            className="home-sort-select"
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value as SortValue)}
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </aside>

                <main className="home-main">
                    {watchingNow.length > 0 && (
                        <div className="home-rail">
                            <h2>Assistindo agora</h2>
                            <div className="home-rail-scroll">
                                {watchingNow.map((item) => (
                                    <div
                                        key={`${item.kind}-${item._id}`}
                                        className="home-rail-card"
                                        onClick={() => navigate(item.kind === 'movie' ? `/movies/${item._id}` : `/shows/${item._id}`)}
                                    >
                                        <img
                                            src={item.posterUrl || 'https://placehold.co/130x195?text=Sem+Capa'}
                                            alt={item.title}
                                            className="home-rail-poster"
                                        />
                                        <div className="home-rail-title">{item.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="home-main-top">
                        <h2>Todos os títulos</h2>
                        <span>{sortedItems.length} títulos</span>
                    </div>

                    {loading && <p className="home-status-message">Carregando...</p>}
                    {error && <p className="home-status-message home-error">{error}</p>}

                    {!loading && !error && (
                        <>
                            <MediaList items={paginatedItems} />

                            {sortedItems.length > 0 && (
                                <div className="home-pagination-wrap">
                                    <div className="home-pagination">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => p - 1)}
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                className={page === currentPage ? 'active' : ''}
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((p) => p + 1)}
                                        >
                                            ›
                                        </button>
                                    </div>

                                    <div className="home-page-size">
                                        Exibindo {pageStart + 1}–{Math.min(pageStart + pageSize, sortedItems.length)} de {sortedItems.length}
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                resetToFirstPage();
                                            }}
                                        >
                                            {PAGE_SIZE_OPTIONS.map((size) => (
                                                <option key={size} value={size}>{size} por página</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <button className="home-fab" onClick={() => setShowForm(true)}>
                +
            </button>

            {showForm && (
                <MediaForm onSubmit={handleAddMedia} onClose={() => setShowForm(false)} />
            )}

            <Footer />
        </div>
    );
}

export default HomePage;