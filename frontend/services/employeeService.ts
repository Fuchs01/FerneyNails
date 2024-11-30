import axios from './axios';
import type { Employee } from '@/types';

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await axios.get('/employees');
  return data;
};

export const getEmployeesBySpeciality = async (speciality: string): Promise<Employee[]> => {
  const { data } = await axios.get(`/employees/by-speciality/${speciality}`);
  return data;
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const { data } = await axios.post('/employees', employee);
  return data;
};

export const updateEmployee = async ({ id, ...employee }: Employee): Promise<Employee> => {
  const { data } = await axios.put(`/employees/${id}`, employee);
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axios.delete(`/employees/${id}`);
};

export const checkEmployeeAvailability = async (
  employeeId: string,
  date: string,
  time: string
): Promise<{ available: boolean; reason?: string }> => {
  const { data } = await axios.get(`/employees/${employeeId}/availability`, {
    params: { date, time }
  });
  return data;
};