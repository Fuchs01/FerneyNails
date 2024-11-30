// settingsService.ts
import axios from './axios';

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

export interface Settings {
  salonName: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    facebook?: string;
    instagram?: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
  };
  loyalty: Loyalty;
}

export const getSettings = async (): Promise<Settings> => {
  const { data } = await axios.get('/settings');
  return data.settings;
};

export const updateSettings = async (settings: Settings): Promise<Settings> => {
  const { data } = await axios.put('/settings', settings);
  return data.settings;
};

// Fonctions utilitaires pour la fidélité
export const getCurrentLevel = (points: number, settings: Settings): Level | null => {
  if (!settings?.loyalty?.levels) return null;
  
  return settings.loyalty.levels
    .sort((a, b) => b.minPoints - a.minPoints)
    .find(level => points >= level.minPoints) || null;
};

export const getNextLevel = (points: number, settings: Settings): Level | null => {
  if (!settings?.loyalty?.levels) return null;
  
  return settings.loyalty.levels
    .sort((a, b) => a.minPoints - b.minPoints)
    .find(level => level.minPoints > points) || null;
};

export const calculatePointsToNext = (points: number, settings: Settings): number | null => {
  const nextLevel = getNextLevel(points, settings);
  if (!nextLevel) return null;
  
  return nextLevel.minPoints - points;
};

export const calculatePointsValue = (points: number, settings: Settings): number => {
  if (!settings?.loyalty?.conversionRate) return 0;
  return points * settings.loyalty.conversionRate;
};

export const calculateEarnedPoints = (amount: number, settings: Settings): number => {
  if (!settings?.loyalty?.pointsPerEuro) return 0;
  return Math.floor(amount * settings.loyalty.pointsPerEuro);
};