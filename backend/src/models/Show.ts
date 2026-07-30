import { Schema, model, Document } from "mongoose";
import type { MovieStatus } from "../types";

// Espelha o Movie.ts
export interface IShow extends Document {
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

const showSchema = new Schema<IShow>({
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
    timestamps: { createdAt: true, updatedAt: false },
});

const Show = model<IShow>("Show", showSchema);

export default Show;
