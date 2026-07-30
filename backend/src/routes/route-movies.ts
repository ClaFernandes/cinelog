import { Router } from "express";
import type { Request, Response } from "express";
import type { CreateMovieDTO, UpdateMediaDTO } from "../types";
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} from "../data/movies";

const router = Router();

// GET /api/movies — retorna a lista inteira de filmes salvos
router.get("/", async (req: Request, res: Response) => {
    try {
        const movies = await getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar filmes", error });
    }
});

// GET /api/movies/:id — retorna um filme específico pelo ID do MongoDB
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const movie = await getMovieById(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: "Filme não encontrado." });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar o filme", error });
    }
});

// POST /api/movies — adiciona um filme novo à coleção pessoal
router.post("/", async (req: Request<{}, {}, CreateMovieDTO>, res: Response) => {
    try {
        const savedMovie = await createMovie(req.body);
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: "Erro ao salvar o filme", error });
    }
});

// PUT /api/movies/:id — atualiza status, nota e/ou resenha de um filme existente
router.put("/:id", async (req: Request<{ id: string }, {}, UpdateMediaDTO>, res: Response) => {
    try {
        const updated = await updateMovie(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({ message: "Filme não encontrado para atualização." });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar o filme", error });
    }
});

// DELETE /api/movies/:id — remove um filme da coleção
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const deleted = await deleteMovie(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Filme não encontrado para remoção." });
        }

        res.status(200).json({ message: "Filme removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar o filme", error });
    }
});

export default router;
