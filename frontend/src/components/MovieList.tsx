import type { Movie } from '../types';
import MovieCard from './MovieCard';
import './MovieList.css';

interface MovieListProps {
    movies: Movie[];
}

function MovieList({ movies }: MovieListProps) {
    // Estado vazio: quando a coleção inteira está vazia
    if (movies.length === 0) {
        return (
            <div className="movie-list-empty">
                <p>Nenhum filme encontrado.</p>
            </div>
        );
    }

    return (
        <div className="movie-list-grid">
            {movies.map((movie) => (
                // key precisa ser o _id do Mongo, único por documento
                <MovieCard key={movie._id} movie={movie} />
            ))}
        </div>
    );
}

export default MovieList;
