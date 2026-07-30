import { Schema, model, Document } from "mongoose";
import type { MovieStatus } from "../types";

// A interface do documento do Mongoose espelha o "Movie" do types/index.ts
export interface IMovie extends Document {
    tmdbId: number;
    title: string;
    year: number;
    genre: string[];
    posterUrl: string;
    trailerKey?: string;
    status: MovieStatus;
    rating?: number;
    review?: string;
    createdAt: Date;
}

const movieSchema = new Schema<IMovie>({
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genre: [{ type: String }],
    posterUrl: { type: String, required: true },
    trailerKey: { type: String },
    status: {
        type: String,
        enum: ['to_watch', 'watching', 'watched'],
        required: true,
        default: 'to_watch',
    },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
}, {
    // Mongoose gera o createdAt quando o documento é salvo,
    timestamps: { createdAt: true, updatedAt: false },
});

const Movie = model<IMovie>("Movie", movieSchema);

export default Movie;
