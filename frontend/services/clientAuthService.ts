import axios from './axios';

// Types et interfaces
export interface PointsHistoryEntry {
  date: string;
  amount: number;
  type: 'earned' | 'spent';
  description: string;
}

export interface ClientLoginCredentials {
  email: string;
  password: string;
}

export interface ClientRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}



export interface Client {
  points: number;
  pointsHistory: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  }}

export interface AuthResponse {
  token: string;
  user: Client;
}

export interface Level {
  name: string;
  minPoints: number;
  discount: number;
}

export interface Loyalty {
  pointsPerEuro: number;
  conversionRate: number;
  levels: Level[];
}

// Fonctions d'authentification
export const registerClient = async (data: ClientRegisterData): Promise<Client> => {
  const { data: response } = await axios.post<AuthResponse>('/clients/register', data);
  if (response.token) {
    localStorage.setItem('clientToken', response.token);
    localStorage.setItem('clientUser', JSON.stringify(response.user));
  }
  return response.user;
};

export const loginClient = async (credentials: ClientLoginCredentials): Promise<Client> => {
  const { data: response } = await axios.post<AuthResponse>('/clients/login', credentials);
  if (response.token) {
    localStorage.setItem('clientToken', response.token);
    localStorage.setItem('clientUser', JSON.stringify(response.user));
  }
  return response.user;
};

export const logoutClient = () => {
  localStorage.removeItem('clientToken');
  localStorage.removeItem('clientUser');
  window.location.href = '/login';
};

export const isClientAuthenticated = () => {
  const token = localStorage.getItem('clientToken');
  const user = localStorage.getItem('clientUser');
  return !!(token && user);
};

export const getCurrentClient = (): Client | null => {
  const userStr = localStorage.getItem('clientUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Fonctions de gestion de la fidélité
export const getLoyaltyProgram = async (): Promise<Loyalty> => {
  const { data } = await axios.get<Loyalty>('/loyalty');
  return data;
};

export const getCurrentLevel = (client: Client, loyalty: Loyalty): Level => {
  const sortedLevels = [...loyalty.levels].sort((a, b) => b.minPoints - a.minPoints);
  return sortedLevels.find(level => client.points >= level.minPoints) || sortedLevels[0];
};

export const getPointsToNextLevel = (client: Client, loyalty: Loyalty): number | null => {
  const currentLevel = getCurrentLevel(client, loyalty);
  const nextLevel = loyalty.levels.find(level => level.minPoints > client.points);
  return nextLevel ? nextLevel.minPoints - client.points : null;
};

export const pointsToEuros = (points: number, loyalty: Loyalty): number => {
  return points * loyalty.conversionRate;
};

export const eurosToPoints = (euros: number, loyalty: Loyalty): number => {
  return euros * loyalty.pointsPerEuro;
};

export const usePointsForDiscount = async (
  amount: number,
  pointsToUse: number
): Promise<{ newTotal: number; remainingPoints: number }> => {
  const { data } = await axios.post<{ newTotal: number; remainingPoints: number }>(
    '/loyalty/use-points',
    { amount, pointsToUse }
  );
  
  const clientStr = localStorage.getItem('clientUser');
  if (clientStr) {
    const client = JSON.parse(clientStr);
    client.points = data.remainingPoints;
    localStorage.setItem('clientUser', JSON.stringify(client));
  }
  
  return data;
};

export const simulatePointsDiscount = (amount: number, pointsToUse: number, loyalty: Loyalty): number => {
  const discountInEuros = pointsToEuros(pointsToUse, loyalty);
  return Math.max(0, amount - discountInEuros);
};

export const updateClientPoints = (newPoints: number) => {
  const clientStr = localStorage.getItem('clientUser');
  if (clientStr) {
    const client = JSON.parse(clientStr);
    client.points = newPoints;
    localStorage.setItem('clientUser', JSON.stringify(client));
  }
};

export const getCurrentLevelDiscount = (client: Client, loyalty: Loyalty): number => {
  const currentLevel = getCurrentLevel(client, loyalty);
  return currentLevel.discount;
};

export const calculateTotalWithLevelDiscount = (amount: number, client: Client, loyalty: Loyalty): number => {
  const discount = getCurrentLevelDiscount(client, loyalty);
  return amount * (1 - discount / 100);
};

export const updatePointsHistory = async (entry: PointsHistoryEntry): Promise<Client> => {
  const { data } = await axios.post<Client>('/clients/points/history', entry);
  
  const clientStr = localStorage.getItem('clientUser');
  if (clientStr) {
    const client = JSON.parse(clientStr);
    client.pointsHistory = client.pointsHistory || [];
    client.pointsHistory.push(entry);
    localStorage.setItem('clientUser', JSON.stringify(client));
  }
  
  return data;
};

export const getPointsHistory = async (): Promise<PointsHistoryEntry[]> => {
  const { data } = await axios.get<PointsHistoryEntry[]>('/clients/points/history');
  return data;
};