import api from './api';

export interface FlashcardDeck {
    id: string;
    title: string;
    description: string | null;
    isPublic: boolean;
    color: string;
    userId: string;
    courseId: string | null;
    user?: {
        id: string;
        name: string;
    };
    course?: {
        id: string;
        title: string;
    };
    _count?: {
        cards: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Flashcard {
    id: string;
    front: string;
    back: string;
    order: number;
    deckId: string;
    createdAt: string;
    updatedAt: string;
    reviews?: FlashcardReview[];
}

export interface FlashcardReview {
    id: string;
    cardId: string;
    userId: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReview: string;
    quality: number;
    reviewedAt: string;
}

export interface CreateDeckData {
    title: string;
    description?: string;
    courseId?: string;
    color?: string;
    isPublic?: boolean;
}

export interface UpdateDeckData {
    title?: string;
    description?: string;
    courseId?: string;
    color?: string;
    isPublic?: boolean;
}

export interface CreateCardData {
    front: string;
    back: string;
}

export interface UpdateCardData {
    front?: string;
    back?: string;
}

export const flashcardService = {
    // Deck operations
    async getMyDecks(): Promise<FlashcardDeck[]> {
        const response = await api.get<FlashcardDeck[]>('/flashcards/decks');
        return response.data;
    },

    async getPublicDecks(): Promise<FlashcardDeck[]> {
        const response = await api.get<FlashcardDeck[]>('/flashcards/decks/public');
        return response.data;
    },

    async createDeck(data: CreateDeckData): Promise<FlashcardDeck> {
        const response = await api.post<FlashcardDeck>('/flashcards/decks', data);
        return response.data;
    },

    async getDeck(id: string): Promise<FlashcardDeck & { cards: Flashcard[]; user: { id: string; name: string } }> {
        const response = await api.get<FlashcardDeck & { cards: Flashcard[]; user: { id: string; name: string } }>(`/flashcards/decks/${id}`);
        return response.data;
    },

    async updateDeck(id: string, data: UpdateDeckData): Promise<FlashcardDeck> {
        const response = await api.put<FlashcardDeck>(`/flashcards/decks/${id}`, data);
        return response.data;
    },

    async deleteDeck(id: string): Promise<void> {
        await api.delete(`/flashcards/decks/${id}`);
    },

    // Card operations
    async createCard(deckId: string, data: CreateCardData): Promise<Flashcard> {
        const response = await api.post<Flashcard>(`/flashcards/decks/${deckId}/cards`, data);
        return response.data;
    },

    async updateCard(id: string, data: UpdateCardData): Promise<Flashcard> {
        const response = await api.put<Flashcard>(`/flashcards/cards/${id}`, data);
        return response.data;
    },

    async deleteCard(id: string): Promise<void> {
        await api.delete(`/flashcards/cards/${id}`);
    },

    // Review operations
    async getCardsForReview(deckId: string): Promise<Flashcard[]> {
        const response = await api.get<Flashcard[]>(`/flashcards/review/${deckId}`);
        return response.data;
    },

    async submitReview(cardId: string, quality: number): Promise<FlashcardReview> {
        const response = await api.post<FlashcardReview>(`/flashcards/review/${cardId}`, { quality });
        return response.data;
    }
};