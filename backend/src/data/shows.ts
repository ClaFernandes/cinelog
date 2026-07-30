import Show, { type IShow } from "../models/Show";
import type { CreateShowDTO, UpdateMediaDTO } from "../types";

export async function getAllShows(): Promise<IShow[]> {
    return await Show.find();
}

export async function getShowById(id: string): Promise<IShow | null> {
    return await Show.findById(id);
}

export async function createShow(showData: CreateShowDTO): Promise<IShow> {
    const newShow = new Show(showData);
    return await newShow.save();
}

export async function updateShow(id: string, showData: UpdateMediaDTO): Promise<IShow | null> {
    return await Show.findByIdAndUpdate(id, showData, { new: true });
}

export async function deleteShow(id: string): Promise<IShow | null> {
    return await Show.findByIdAndDelete(id);
}
