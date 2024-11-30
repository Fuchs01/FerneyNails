import axios from './axios';
import type { Appointment } from '@/types';

const API_URL = '/appointments';

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> => {
  try {
    const { data } = await axios.post(API_URL, appointment);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du rendez-vous');
  }
};

export const updateAppointment = async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
  try {
    const { data } = await axios.put(`${API_URL}/${id}`, appointment);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du rendez-vous');
  }
};

export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du rendez-vous');
  }
};