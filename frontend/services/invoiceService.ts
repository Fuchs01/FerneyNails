import axios from './axios';

export interface Invoice {
  id: string;
  appointmentId: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  amount: number;
  date: string;
  status: string;
}

export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await axios.get('/invoices');
  return data;
};

export const resendInvoice = async (invoiceId: string): Promise<void> => {
  await axios.post(`/invoices/${invoiceId}/resend`);
};