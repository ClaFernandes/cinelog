import { Router } from "express";
import type { Request, Response } from "express";
import type { CreateShowDTO, UpdateMediaDTO } from "../types";
import {
    getAllShows,
    getShowById,
    createShow,
    updateShow,
    deleteShow,
} from "../data/shows";

const router = Router();

// GET /api/shows — retorna todas as séries salvas
router.get("/", async (req: Request, res: Response) => {
    try {
        const shows = await getAllShows();
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar séries", error });
    }
});

// GET /api/shows/:id — retorna uma série específica pelo ID do MongoDB
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const show = await getShowById(req.params.id);

        if (!show) {
            return res.status(404).json({ message: "Série não encontrada." });
        }

        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar a série", error });
    }
});

// POST /api/shows — adiciona uma série à coleção pessoal
router.post("/", async (req: Request<{}, {}, CreateShowDTO>, res: Response) => {
    try {
        const savedShow = await createShow(req.body);
        res.status(201).json(savedShow);
    } catch (error) {
        res.status(400).json({ message: "Erro ao salvar a série", error });
    }
});

// PUT /api/shows/:id — atualiza status, nota e/ou resenha de uma série
router.put("/:id", async (req: Request<{ id: string }, {}, UpdateMediaDTO>, res: Response) => {
    try {
        const updated = await updateShow(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({ message: "Série não encontrada para atualização." });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Erro ao atualizar a série", error });
    }
});

// DELETE /api/shows/:id — remove uma série da coleção
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const deleted = await deleteShow(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Série não encontrada para remoção." });
        }

        res.status(200).json({ message: "Série removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar a série", error });
    }
});

export default router;
