import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@services/statsService';
import { Line } from 'react-chartjs-2';
import { canViewFullDashboard } from '@/services/authService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats
  });

  const showFullDashboard = canViewFullDashboard();

  const chartData = {
    labels: stats?.revenueChart?.labels || [],
    datasets: [{
      label: "Chiffre d'affaires 2024",
      data: stats?.revenueChart?.datasets[0]?.data || [],
      borderColor: 'rgb(236, 72, 153)',
      tension: 0.3
    }]
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Tableau de bord</h2>
      
      {/* Stats Cards - Only for admin and gérant */}
      {showFullDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Clients actifs</h3>
                <p className="text-3xl font-bold mt-2">{stats?.activeClients || 0}</p>
                <p className="text-green-500 text-sm mt-2">+{stats?.monthlyGrowth || 0}% vs mois dernier</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Rendez-vous aujourd'hui</h3>
                <p className="text-3xl font-bold mt-2">{stats?.todayAppointments || 0}</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Chiffre d'affaires mensuel</h3>
                <p className="text-3xl font-bold mt-2">{stats?.monthlyRevenue || 0}€</p>
                <p className="text-green-500 text-sm mt-2">+{stats?.monthlyGrowth || 0}% vs mois dernier</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-500 text-sm">Points fidélité distribués</h3>
                <p className="text-3xl font-bold mt-2">0</p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Chart - Only for admin and gérant */}
      {showFullDashboard && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Chiffre d'affaires</h3>
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services - Only for admin and gérant */}
        {showFullDashboard && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Services populaires</h3>
            <div className="space-y-4">
              {stats?.popularServices?.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.reservations} réservations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{service.revenue}€</p>
                    <p className="text-sm text-green-500">+{service.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Appointments - For all roles */}
        <div className={`bg-white p-6 rounded-lg shadow ${!showFullDashboard ? 'lg:col-span-2' : ''}`}>
          <h3 className="text-xl font-semibold mb-4">Rendez-vous à venir</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Employé</th>
                  <th className="px-4 py-2">Date et heure</th>
                  <th className="px-4 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats?.upcomingAppointments?.map((appointment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{appointment.client}</td>
                    <td className="px-4 py-2">
                      <div>
                        {appointment.service}
                        <span className="text-gray-500 text-sm block">{appointment.duration}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{appointment.employee}</td>
                    <td className="px-4 py-2">
                      <div>
                        {appointment.date}
                        <span className="text-gray-500 text-sm block">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        appointment.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmé' :
                         appointment.status === 'cancelled' ? 'Annulé' :
                         appointment.status === 'paid' ? 'Payé' :
                         'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;