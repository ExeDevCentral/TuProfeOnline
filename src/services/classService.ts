import api from './api';

export interface Class {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  teacher: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  startTime: string;
  endTime: string;
  meetUrl?: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  room?: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: any[];
}

export interface CreateClassData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meetUrl?: string;
  room?: string;
}

export const classService = {
  async getClasses(): Promise<Class[]> {
    const response = await api.get<Class[]>('/classes');
    return response.data;
  },

  async getClass(id: string): Promise<Class> {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  async createClass(data: CreateClassData): Promise<Class> {
    const response = await api.post<Class>('/classes', data);
    return response.data;
  },

  async updateClassStatus(id: string, status: Class['status']): Promise<Class> {
    const response = await api.patch<Class>(`/classes/${id}/status`, { status });
    return response.data;
  },

  async enrollInClass(id: string): Promise<any> {
    const response = await api.post(`/classes/${id}/enroll`);
    return response.data;
  },
};
