import axios from './axios';

export interface Stats {
  activeClients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  revenueChart: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
    }[];
  };
  popularServices: {
    name: string;
    reservations: number;
    revenue: number;
    growth: number;
  }[];
  upcomingAppointments: {
    client: string;
    service: string;
    duration: string;
    employee: string;
    date: string;
    time: string;
    status: string;
  }[];
}

export const getStats = async (): Promise<Stats> => {
  const { data } = await axios.get('/stats');
  return data;
};