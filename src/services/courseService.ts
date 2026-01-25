import api from './api';

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string | null;
    price: number;
    teacher: {
        name: string;
        avatar: string | null;
    };
    _count?: {
        sections: number;
        enrollments: number;
    };
    progress?: number; // Only for my-courses
}

export const courseService = {
    // Get all published courses (Marketplace)
    async getPublishedCourses(): Promise<Course[]> {
        const response = await api.get<Course[]>('/courses');
        return response.data;
    },

    // Get my enrolled courses
    async getMyCourses(): Promise<Course[]> {
        const response = await api.get<Course[]>('/courses/my-courses');
        return response.data;
    },

    // Get course details
    async getCourseDetails(id: string): Promise<any> {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    // Enroll in a course
    async enroll(id: string): Promise<void> {
        await api.post(`/courses/${id}/enroll`);
    }
};
