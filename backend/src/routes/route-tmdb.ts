import { Router } from 'express';
import type { Request, Response } from 'express';
import { searchMovies, searchShows, getMovieDetails, getShowDetails } from '../services/tmdb.service';

const router = Router();

// GET /api/tmdb/search — busca de FILMES na TMDB
router.get('/search', async (req: Request, res: Response) => {
    const query = req.query.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Parâmetro "query" é obrigatório.' });
    }

    try {
        const results = await searchMovies(query);
        return res.json(results);
    } catch (error) {
        console.error('Erro ao buscar filmes no TMDB:', error);
        return res.status(500).json({ message: 'Erro ao buscar filmes. Tente novamente mais tarde.' });
    }
});

// GET /api/tmdb/:tmdbId/details — sinopse, elenco, trailer e recomendações de FILME
router.get('/:tmdbId/details', async (req: Request<{ tmdbId: string }>, res: Response) => {
    const tmdbId = Number(req.params.tmdbId);

    if (isNaN(tmdbId)) {
        return res.status(400).json({ message: 'tmdbId inválido.' });
    }

    try {
        const details = await getMovieDetails(tmdbId);
        return res.json(details);
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme na TMDB:', error);
        return res.status(500).json({ message: 'Erro ao buscar detalhes do filme.' });
    }
});

// GET /api/tmdb/tv/search — busca de SÉRIES 
router.get('/tv/search', async (req: Request, res: Response) => {
    const query = req.query.query;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Parâmetro "query" é obrigatório.' });
    }

    try {
        const results = await searchShows(query);
        return res.json(results);
    } catch (error) {
        console.error('Erro ao buscar séries no TMDB:', error);
        return res.status(500).json({ message: 'Erro ao buscar séries. Tente novamente mais tarde.' });
    }
});

// GET /api/tmdb/tv/:tmdbId/details — sinopse, elenco, trailer, recomendações e temporadas
router.get('/tv/:tmdbId/details', async (req: Request<{ tmdbId: string }>, res: Response) => {
    const tmdbId = Number(req.params.tmdbId);

    if (isNaN(tmdbId)) {
        return res.status(400).json({ message: 'tmdbId inválido.' });
    }

    try {
        const details = await getShowDetails(tmdbId);
        return res.json(details);
    } catch (error) {
        console.error('Erro ao buscar detalhes da série na TMDB:', error);
        return res.status(500).json({ message: 'Erro ao buscar detalhes da série.' });
    }
});

export default router;
