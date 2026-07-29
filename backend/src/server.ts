import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from './db/connection';
import tmdbRoutes from './routes/route-tmdb';
import movieRoutes from './routes/route-movies';

const app = express();

// Middlewares para a API REST
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
connectDB();

// Regista as rotas do TMDB
app.use('/api/tmdb', tmdbRoutes);

// Regista as rotas CRUD de filmes na URL /api/movies
app.use('/api/movies', movieRoutes);

// Middleware para rotas inexistentes (404)
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Rota não encontrada.' });
});

// Middleware global para tratamento de erros (500)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Erro interno no servidor:', err.stack);
    res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});