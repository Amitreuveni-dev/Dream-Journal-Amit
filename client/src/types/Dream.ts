export interface DreamFormData {
    title: string;
    content: string;
    date?: string;
    clarity: number;
    mood: string;
    tags: string[];
    isFavorite: boolean;
}

export interface Dream {
    _id: string;
    userId: string;

    title: string;
    content: string;
    date: string;

    clarity: number;
    mood: string;
    tags: string[];
    isFavorite: boolean;

    createdAt: string;
    updatedAt: string;
}
