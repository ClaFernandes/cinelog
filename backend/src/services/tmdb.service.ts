import axios from 'axios';
import type {
    TmdbResultDTO,
    TmdbShowResultDTO,
    MediaSearchResult,
    MovieDetails,
    ShowDetails,
    CastMember,
    SimilarMedia,
    AirStatus,
} from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

interface TmdbSearchResponse {
    results: (TmdbResultDTO & { genre_ids: number[] })[];
}

interface TmdbShowSearchResponse {
    results: (TmdbShowResultDTO & { genre_ids: number[] })[];
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

// Resposta de detalhes de série
interface TmdbShowDetailsResponse {
    overview: string;
    number_of_seasons: number;
    number_of_episodes: number;
    status: string;
    credits: { cast: TmdbCastMemberRaw[] };
    videos: { results: TmdbVideoRaw[] };
    recommendations: { results: (TmdbShowResultDTO & { genre_ids: number[] })[] };
}

// Cache em memória — os gêneros de filme e de série usam listas DIFERENTES na TMDB
let movieGenreMapCache: Map<number, string> | null = null;
let showGenreMapCache: Map<number, string> | null = null;

async function getGenreMap(kind: 'movie' | 'tv'): Promise<Map<number, string>> {
    const cache = kind === 'movie' ? movieGenreMapCache : showGenreMapCache;
    if (cache) return cache;

    try {
        const response = await axios.get<TmdbGenreListResponse>(`${TMDB_BASE_URL}/genre/${kind}/list`, {
            params: { api_key: API_KEY, language: 'pt-BR' },
        });

        const map = new Map<number, string>();
        response.data.genres.forEach((genre) => map.set(genre.id, genre.name));

        if (kind === 'movie') movieGenreMapCache = map;
        else showGenreMapCache = map;

        return map;
    } catch (error) {
        console.error(`Erro ao buscar lista de gêneros (${kind}) do TMDB:`, error);
        return new Map();
    }
}

// Traduz o status cru da TMDB (em inglês, com variações) pro nosso enum fixo
function mapAirStatus(rawStatus: string): AirStatus {
    const normalized = rawStatus.toLowerCase();
    if (normalized.includes('ended')) return 'ended';
    if (normalized.includes('cancel')) return 'canceled';
    return 'returning';
}

// Busca de filmes
export async function searchMovies(query: string): Promise<MediaSearchResult[]> {
    const genreMap = await getGenreMap('movie');

    const response = await axios.get<TmdbSearchResponse>(`${TMDB_BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query, language: 'pt-BR' },
    });

    return response.data.results.map((raw) => mapMovieToSearchResult(raw, genreMap));
}

// Busca de séries 
export async function searchShows(query: string): Promise<MediaSearchResult[]> {
    const genreMap = await getGenreMap('tv');

    const response = await axios.get<TmdbShowSearchResponse>(`${TMDB_BASE_URL}/search/tv`, {
        params: { api_key: API_KEY, query, language: 'pt-BR' },
    });

    return response.data.results.map((raw) => mapShowToSearchResult(raw, genreMap));
}

export async function getTrailerKey(tmdbId: number): Promise<string | undefined> {
    const response = await axios.get<{ results: TmdbVideoRaw[] }>(`${TMDB_BASE_URL}/movie/${tmdbId}/videos`, {
        params: { api_key: API_KEY, language: 'pt-BR' },
    });

    const trailer = response.data.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
    return trailer?.key;
}

// Detalhes de filme
export async function getMovieDetails(tmdbId: number): Promise<MovieDetails> {
    const genreMap = await getGenreMap('movie');

    const response = await axios.get<TmdbMovieDetailsResponse>(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
        params: { api_key: API_KEY, language: 'pt-BR', append_to_response: 'credits,videos,recommendations' },
    });

    const data = response.data;
    const cast = mapCast(data.credits.cast);
    const trailer = data.videos.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
    const similar = data.recommendations.results.slice(0, 10).map((raw) => mapMovieToSearchResult(raw, genreMap));

    return { overview: data.overview, cast, trailerKey: trailer?.key, similar };
}

// Detalhes de série
export async function getShowDetails(tmdbId: number): Promise<ShowDetails> {
    const genreMap = await getGenreMap('tv');

    const response = await axios.get<TmdbShowDetailsResponse>(`${TMDB_BASE_URL}/tv/${tmdbId}`, {
        params: { api_key: API_KEY, language: 'pt-BR', append_to_response: 'credits,videos,recommendations' },
    });

    const data = response.data;
    const cast = mapCast(data.credits.cast);
    const trailer = data.videos.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
    const similar = data.recommendations.results.slice(0, 10).map((raw) => mapShowToSearchResult(raw, genreMap));

    return {
        overview: data.overview,
        cast,
        trailerKey: trailer?.key,
        similar,
        numberOfSeasons: data.number_of_seasons,
        numberOfEpisodes: data.number_of_episodes,
        airStatus: mapAirStatus(data.status),
    };
}

function mapCast(rawCast: TmdbCastMemberRaw[]): CastMember[] {
    return rawCast.slice(0, 8).map((member) => ({
        name: member.name,
        character: member.character,
        photoUrl: member.profile_path ? `https://image.tmdb.org/t/p/w200${member.profile_path}` : undefined,
    }));
}

function mapMovieToSearchResult(
    raw: TmdbResultDTO & { genre_ids: number[] },
    genreMap: Map<number, string>
): MediaSearchResult {
    const genreNames = (raw.genre_ids || []).map((id) => genreMap.get(id)).filter((n): n is string => Boolean(n));

    return {
        tmdbId: raw.id,
        title: raw.title,
        year: raw.release_date ? Number(raw.release_date.split('-')[0]) : 0,
        genre: genreNames,
        posterUrl: raw.poster_path ? `https://image.tmdb.org/t/p/w500${raw.poster_path}` : '',
    };
}

// Mesma lógica do mapMovieToSearchResult, mas lendo os nomes de campo de série
function mapShowToSearchResult(
    raw: TmdbShowResultDTO & { genre_ids: number[] },
    genreMap: Map<number, string>
): SimilarMedia {
    const genreNames = (raw.genre_ids || []).map((id) => genreMap.get(id)).filter((n): n is string => Boolean(n));

    return {
        tmdbId: raw.id,
        title: raw.name,
        year: raw.first_air_date ? Number(raw.first_air_date.split('-')[0]) : 0,
        genre: genreNames,
        posterUrl: raw.poster_path ? `https://image.tmdb.org/t/p/w500${raw.poster_path}` : '',
    };
}
