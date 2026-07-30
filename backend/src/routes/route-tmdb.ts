import { Router } from 'express';
import type { Request, Response } from 'express';
import { searchMovies, getMovieDetails } from '../services/tmdb.service';

const router = Router();

// GET — busca de filmes na API do TMDB
// O backend chama o service e devolve pro frontend um array de TmdbSearchResult
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

// GET — sinopse, elenco, trailer e recomendações, buscado numa única chamada 
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

export default router;
