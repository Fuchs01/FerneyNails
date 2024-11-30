import axios from './axios';
import type { Appointment } from '@/types';

export const getClientAppointments = async (): Promise<Appointment[]> => {
  const { data } = await axios.get('/clients/appointments');
  return data;
};

export const createClientAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<Appointment> => {
  const { data } = await axios.post('/clients/appointments', appointment);
  return data;
};

export const cancelAppointment = async (id: string): Promise<void> => {
  await axios.post(`/clients/appointments/${id}/cancel`);
};