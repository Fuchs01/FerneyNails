//ProfilePage.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentClient } from '@/services/clientAuthService';
import { getSettings } from '@/services/settingsService';
import { getClientInvoices } from '@/services/clientInvoiceService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';



// Types
interface Level {
  name: string;
  minPoints: number;
  discount: number;
}


interface Invoice {
  id: string;
  serviceName: string;
  amount: number;
  pointsEarned?: number;
  date: string;
}

const ProfilePage = () => {
  const client = getCurrentClient();
  


  
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['clientInvoices'],
    queryFn: getClientInvoices
  });

  if (!client || !settings?.loyalty?.levels) {
    return null;
  }


  // Rapatriment de niveux de point
  const getCurrentLevel = (): Level | undefined => {
    return settings.loyalty.levels
      .sort((a, b) => b.minPoints - a.minPoints)
      .find(level => (client?.points ?? 0) >= level.minPoints);
  };

  const getNextLevel = (): Level | undefined => {
    return settings.loyalty.levels
      .sort((a, b) => a.minPoints - b.minPoints)
      .find(level => level.minPoints > (client?.points ?? 0));
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();


  console.log('Client:', client);
  console.log('Settings:', settings);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Informations personnelles */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Nom</p>
              <p className="font-medium">{client.lastName}</p>
            </div>
            <div>
              <p className="text-gray-600">Prénom</p>
              <p className="font-medium">{client.firstName}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Téléphone</p>
              <p className="font-medium">{client.phone}</p>
            </div>
          </div>
        </div>

        {/* Points de fidélité */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Fidélité</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Points actuels</p>
              <p className="text-3xl font-bold text-pink-600">{client.points}</p>
              <p className="text-sm text-gray-500">
                Valeur: {(client.points * settings.loyalty.conversionRate).toFixed(2)}€
              </p>
            </div>
            <div>
              <p className="text-gray-600">Niveau actuel</p>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{currentLevel?.name || 'Bronze'}</span>
                {currentLevel && typeof currentLevel.discount === 'number' && currentLevel.discount > 0 && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    -{currentLevel.discount}%
                  </span>
                )}
              </div>
            </div>
            {nextLevel && (
              <div>
                <p className="text-gray-600">Prochain niveau</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{nextLevel.name}</span>
                    {typeof nextLevel.discount === 'number' && nextLevel.discount > 0 && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        -{nextLevel.discount}%
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, ((client.points || 0) / nextLevel.minPoints * 100))}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {nextLevel.minPoints - (client.points || 0)} points restants
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historique des points */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Historique des points</h2>
          <div className="space-y-4">
            {client.pointsHistory?.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(entry.date), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <span className={`font-medium ${
                  entry.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {entry.type === 'earned' ? '+' : '-'}{entry.amount}
                </span>
              </div>
            ))}
            {(!client.pointsHistory || client.pointsHistory.length === 0) && (
              <p className="text-gray-500 text-center">Aucun historique disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Tableau des niveaux */}
      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">Niveaux de fidélité</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Points requis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avantages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settings.loyalty.levels.map((level) => (
                <tr key={level.name} className={
                  currentLevel?.name === level.name ? 'bg-pink-50' : ''
                }>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {level.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {level.minPoints} points
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {level.discount > 0 ? (
                      <span className="text-green-600">
                        {level.discount}% de réduction sur les services
                      </span>
                    ) : (
                      'Aucun avantage particulier'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {currentLevel?.name === level.name ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Niveau actuel
                      </span>
                    ) : client.points >= level.minPoints ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Niveau atteint
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {level.minPoints - client.points} points restants
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Factures */}
      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">Mes factures</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Facture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points gagnés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {invoice.amount.toFixed(2)}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">
                    +{invoice.pointsEarned || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(invoice.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucune facture disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;