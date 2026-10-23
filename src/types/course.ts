export interface Lesson {
    id: string;
    title: string;
    description?: string;
    videoUrl?: string; // Optional because it might be locked
    duration: number; // seconds
    isFree: boolean;
    order: number;
    completed?: boolean; // From progress
}

export interface Section {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    price: number;
    teacher: {
        name: string;
        avatar?: string;
        email?: string;
    };
    sections: Section[];
    isEnrolled?: boolean;
    totalDuration?: number; // Calculated frontend side usually
    progress?: number; // 0-100
}
