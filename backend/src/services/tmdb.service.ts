import axios from 'axios';
import type { TmdbResultDTO, TmdbSearchResult, MovieDetails, CastMember, SimilarMovie } from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

interface TmdbSearchResponse {
    results: (TmdbResultDTO & { genre_ids: number[] })[];
}

interface TmdbGenre {
    id: number;
    name: string;
}

interface TmdbGenreListResponse {
    genres: TmdbGenre[];
}

interface TmdbCastMemberRaw {
    name: string;
    character: string;
    profile_path: string | null;
}

interface TmdbVideoRaw {
    key: string;
    site: string;
    type: string;
}

interface TmdbMovieDetailsResponse {
    overview: string;
    credits: { cast: TmdbCastMemberRaw[] };
    videos: { results: TmdbVideoRaw[] };
    recommendations: { results: (TmdbResultDTO & { genre_ids: number[] })[] };
}

let genreMapCache: Map<number, string> | null = null;

async function getGenreMap(): Promise<Map<number, string>> {
    if (genreMapCache) {
        return genreMapCache;
    }

    try {
        const response = await axios.get<TmdbGenreListResponse>(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: {
                api_key: API_KEY,
                language: 'pt-BR',
            },
        });

        const map = new Map<number, string>();
        response.data.genres.forEach((genre) => {
            map.set(genre.id, genre.name);
        });

        genreMapCache = map;
        return genreMapCache;
    } catch (error) {
        console.error('Erro ao buscar lista de gêneros do TMDB:', error);
        return new Map();
    }
}

export async function searchMovies(query: string): Promise<TmdbSearchResult[]> {
    const genreMap = await getGenreMap();

    const response = await axios.get<TmdbSearchResponse>(`${TMDB_BASE_URL}/search/movie`, {
        params: {
            api_key: API_KEY,
            query,
            language: 'pt-BR',
        },
    });

    return response.data.results.map((raw) => mapToSearchResult(raw, genreMap));
}

export async function getTrailerKey(tmdbId: number): Promise<string | undefined> {
    const response = await axios.get<{ results: TmdbVideoRaw[] }>(`${TMDB_BASE_URL}/movie/${tmdbId}/videos`, {
        params: {
            api_key: API_KEY,
            language: 'pt-BR',
        },
    });

    const trailer = response.data.results.find(
        (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    return trailer?.key;
}

// Busca tudo que a MoviePage precisa 
export async function getMovieDetails(tmdbId: number): Promise<MovieDetails> {
    const genreMap = await getGenreMap();

    const response = await axios.get<TmdbMovieDetailsResponse>(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
        params: {
            api_key: API_KEY,
            language: 'pt-BR',
            append_to_response: 'credits,videos,recommendations',
        },
    });

    const data = response.data;

    // Elenco: pega só os 8 primeiros 
    const cast: CastMember[] = data.credits.cast.slice(0, 8).map((member) => ({
        name: member.name,
        character: member.character,
        photoUrl: member.profile_path
            ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
            : undefined,
    }));

    const trailer = data.videos.results.find(
        (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    const similar: SimilarMovie[] = data.recommendations.results
        .slice(0, 10)
        .map((raw) => mapToSimilarMovie(raw, genreMap));

    return {
        overview: data.overview,
        cast,
        trailerKey: trailer?.key,
        similar,
    };
}

function mapToSearchResult(
    raw: TmdbResultDTO & { genre_ids: number[] },
    genreMap: Map<number, string>
): TmdbSearchResult {
    const genreNames = (raw.genre_ids || [])
        .map((id) => genreMap.get(id))
        .filter((name): name is string => Boolean(name));

    return {
        tmdbId: raw.id,
        title: raw.title,
        year: raw.release_date ? Number(raw.release_date.split('-')[0]) : 0,
        genre: genreNames,
        posterUrl: raw.poster_path
            ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
            : '',
    };
}

function mapToSimilarMovie(
    raw: TmdbResultDTO & { genre_ids: number[] },
    genreMap: Map<number, string>
): SimilarMovie {
    const genreNames = (raw.genre_ids || [])
        .map((id) => genreMap.get(id))
        .filter((name): name is string => Boolean(name));

    return {
        tmdbId: raw.id,
        title: raw.title,
        year: raw.release_date ? Number(raw.release_date.split('-')[0]) : 0,
        genre: genreNames,
        posterUrl: raw.poster_path
            ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
            : '',
    };
}
