import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/services/adminClientService';
import { getSettings } from '@/services/settingsService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const LoyaltyPage = () => {
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const getLoyaltyLevel = (points: number) => {
    if (!settings?.loyalty?.levels) return null;
    return settings.loyalty.levels
      .sort((a, b) => b.minPoints - a.minPoints)
      .find(level => points >= level.minPoints);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programme de fidélité</h2>
      </div>

      {/* Niveaux de fidélité */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Niveaux de fidélité</h3>
        <div className="grid grid-cols-4 gap-4">
          {settings?.loyalty?.levels?.map((level) => (
            <div key={level.name} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg">{level.name}</h4>
              <p className="text-sm text-gray-600">À partir de {level.minPoints} points</p>
              <p className="text-pink-600 font-medium">-{level.discount}% sur les services</p>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des clients avec leurs points */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points actuels
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Historique récent
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => {
              const level = getLoyaltyLevel(client.points || 0);
              const recentHistory = client.pointsHistory?.slice(0, 3) || [];

              return (
                <tr key={client.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{client.firstName} {client.lastName}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-semibold text-pink-600">
                      {client.points || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                      level?.name === 'Bronze' ? 'bg-yellow-100 text-yellow-800' :
                      level?.name === 'Argent' ? 'bg-gray-100 text-gray-800' :
                      level?.name === 'Or' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {level?.name || 'Bronze'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {recentHistory.map((entry, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{entry.description}</span>
                          <span className={entry.type === 'earned' ? 'text-green-600' : 'text-red-600'}>
                            {entry.type === 'earned' ? '+' : '-'}{entry.amount}
                          </span>
                        </div>
                      ))}
                      {recentHistory.length === 0 && (
                        <span className="text-sm text-gray-500">Aucun historique</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoyaltyPage;