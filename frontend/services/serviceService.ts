import axios from './axios';
import type { Service } from '@/types';

interface ServiceFilters {
  category?: string;
  technique?: string;
  duration?: string;
  priceRange?: string;
}

export const getServices = async (filters?: ServiceFilters): Promise<Service[]> => {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.technique && filters.technique !== 'all') {
      params.append('technique', filters.technique);
    }
  }

  const { data } = await axios.get('/services', { params });
  return data;
};

export const createService = async (service: Omit<Service, 'id'>): Promise<Service> => {
  const { data } = await axios.post('/services', service);
  return data;
};

export const updateService = async ({ id, ...service }: Service): Promise<Service> => {
  const { data } = await axios.put(`/services/${id}`, service);
  return data;
};

export const deleteService = async (id: string): Promise<void> => {
  await axios.delete(`/services/${id}`);
};