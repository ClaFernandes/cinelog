import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import StatusFilter, { type StatusFilterValue } from '../components/StatusFilter';
import MovieList from '../components/MovieList';
import MovieForm from '../components/MovieForm';
import { useMovies } from '../hooks/useMovies';
import type { CreateMovieDTO } from '../types';
import './HomePage.css';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function HomePage() {
    const navigate = useNavigate();
    const { movies, loading, error, addMovie } = useMovies();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredMovies = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return movies.filter((movie) => {
            const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
            const matchesSearch =
                query === '' ||
                movie.title.toLowerCase().includes(query) ||
                movie.genre.some((g) => g.toLowerCase().includes(query));

            return matchesStatus && matchesSearch;
        });
    }, [movies, statusFilter, searchQuery]);

    const watchingNow = useMemo(
        () => movies.filter((movie) => movie.status === 'watching'),
        [movies]
    );

    const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const paginatedMovies = filteredMovies.slice(pageStart, pageStart + pageSize);

    const handleStatusChange = (value: StatusFilterValue) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const handleAddMovie = async (movieData: CreateMovieDTO) => {
        await addMovie(movieData);
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
                        movies={movies}
                        selected={statusFilter}
                        onChange={handleStatusChange}
                    />
                </aside>

                <main className="home-main">
                    {watchingNow.length > 0 && (
                        <div className="home-rail">
                            <h2>Assistindo agora</h2>
                            <div className="home-rail-scroll">
                                {watchingNow.map((movie) => (
                                    <div
                                        key={movie._id}
                                        className="home-rail-card"
                                        onClick={() => navigate(`/movies/${movie._id}`)}
                                    >
                                        <img
                                            src={movie.posterUrl || 'https://placehold.co/130x195?text=Sem+Capa'}
                                            alt={movie.title}
                                            className="home-rail-poster"
                                        />
                                        <div className="home-rail-title">{movie.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="home-main-top">
                        <h2>Todos os filmes</h2>
                        <span>{filteredMovies.length} títulos</span>
                    </div>

                    {loading && <p className="home-status-message">Carregando filmes...</p>}
                    {error && <p className="home-status-message home-error">{error}</p>}

                    {!loading && !error && (
                        <>
                            <MovieList movies={paginatedMovies} />

                            {filteredMovies.length > 0 && (
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
                                        Exibindo {pageStart + 1}–{Math.min(pageStart + pageSize, filteredMovies.length)} de {filteredMovies.length}
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setCurrentPage(1);
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
                <MovieForm onSubmit={handleAddMovie} onClose={() => setShowForm(false)} />
            )}

            <Footer />
        </div>
    );
}

export default HomePage;