import axios from './axios';
import type { Client } from '@/types';






export const getClients = async (): Promise<Client[]> => {
  const { data } = await axios.get('/admin/clients');
  return data;
};

export const createClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
  const { data } = await axios.post('/admin/clients', client);
  return data;
};

export const updateClient = async ({ id, ...client }: Client): Promise<Client> => {
  const { data } = await axios.put(`/admin/clients/${id}`, client);
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await axios.delete(`/admin/clients/${id}`);
};