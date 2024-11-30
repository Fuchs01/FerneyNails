export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'no_show' | 'paid';
  notes?: string;
  createdAt: string;
  price?: number;
  invoiceUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  appRole: 'employe' | 'administrateur' | 'gerant';
  speciality: 'onglerie' | 'coiffure' | 'les_deux';
  schedule: {
    [key: string]: {
      enabled: boolean;
      slots: Array<{
        start: string;
        end: string;
      }>;
    };
  };
  absences: Array<{
    start: string;
    end: string;
    reason: string;
  }>;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  category: 'nails' | 'hair';
  technique: 'gel' | 'semi-permanent' | 'natural' | 'cut' | 'color' | 'brushing';
  image?: string;
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
  };
  createdAt: string;
}