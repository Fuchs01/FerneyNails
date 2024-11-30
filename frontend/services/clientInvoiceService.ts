import axios from './axios';

export interface ClientInvoice {
  id: string;
  appointmentId: string;
  serviceName: string;
  amount: number;
  pointsEarned?: number;
  date: string;
  status: string;
  invoiceUrl?: string;
}

export const getClientInvoices = async (): Promise<ClientInvoice[]> => {
  const { data } = await axios.get('/clients/invoices');
  return data;
};

// Fonction utilitaire pour calculer les points gagnés si non fournis
export const calculatePointsEarned = (amount: number, pointsPerEuro: number): number => {
  return Math.floor(amount * pointsPerEuro);
};

// Fonction pour obtenir une facture spécifique
export const getClientInvoice = async (invoiceId: string): Promise<ClientInvoice> => {
  const { data } = await axios.get(`/clients/invoices/${invoiceId}`);
  return data;
};

// Fonction pour télécharger une facture
export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
  const response = await axios.get(`/clients/invoices/${invoiceId}/download`, {
    responseType: 'blob'
  });
  return response.data;
};