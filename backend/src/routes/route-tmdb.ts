import { Router } from 'express';
import type { Request, Response } from 'express';
import { searchMovies } from '../services/tmdb.service';

const router = Router();

// Busca de filmes na API do TMDB
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

export default router;