import api from "./api";
import type { DreamFormData, Dream } from "../../types/Dream";

export const getDreams = async (): Promise<Dream[]> => {
    const res = await api.get("/dream");
    return res.data.dreams;
};

export const getDreamById = async (id: string): Promise<Dream> => {
    const res = await api.get(`/dream/${id}`);
    return res.data.dream;
};

export const createDream = async (dreamData: DreamFormData): Promise<Dream> => {
    const res = await api.post("/dream", dreamData);
    return res.data.dream;
};

export const updateDream = async (
    id: string,
    updates: Partial<DreamFormData>
): Promise<Dream> => {
    const res = await api.put(`/dream/${id}`, updates);
    return res.data.dream;
};

export const deleteDream = async (id: string): Promise<Dream> => {
    const res = await api.delete(`/dream/${id}`);
    return res.data.dream;
};

export const toggleFavorite = async (id: string): Promise<Dream> => {
    const res = await api.put(`/dream/${id}/favorite`);
    return res.data.dream;
};

export const getFavorites = async (): Promise<Dream[]> => {
    const res = await api.get("/dream/favorites");
    return res.data.favorites;
};
