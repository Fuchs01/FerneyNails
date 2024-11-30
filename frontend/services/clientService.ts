import axios from './axios';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  pointsHistory: Array<{
    type: 'add' | 'redeem';
    points: number;
    reason?: string;
    description?: string;
    date: string;
  }>;
}

export const searchClients = async (query: string): Promise<Client[]> => {
  const { data } = await axios.get(`/clients/search?q=${encodeURIComponent(query)}`);
  return data;
};