import Movie, { type IMovie } from "../models/Movie";
import type { CreateMovieDTO, UpdateMovieDTO } from "../types";

// Retorna todos os filmes cadastrados no MongoDB
export async function getAllMovies(): Promise<IMovie[]> {
    return await Movie.find();
}

// Busca um único filme pelo o ID do MongoDB
export async function getMovieById(id: string): Promise<IMovie | null> {
    return await Movie.findById(id);
}

// Insere um novo filme no banco de dados
export async function createMovie(movieData: CreateMovieDTO): Promise<IMovie> {
    const newMovie = new Movie(movieData);
    return await newMovie.save();
}

// Atualiza os dados de um filme existente e retorna a versão atualizada
export async function updateMovie(id: string, movieData: UpdateMovieDTO): Promise<IMovie | null> {
    return await Movie.findByIdAndUpdate(id, movieData, { new: true });
}

// Remove um filme pelo ID
export async function deleteMovie(id: string): Promise<IMovie | null> {
    return await Movie.findByIdAndDelete(id);
}