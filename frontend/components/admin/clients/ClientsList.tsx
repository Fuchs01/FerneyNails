import React from 'react';
import type { Client } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientsList: React.FC<Props> = ({ clients, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresse
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inscription
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.firstName} {client.lastName}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div>{client.email}</div>
                  <div className="text-gray-500">{client.phone}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div>{client.address.street}</div>
                  <div>{client.address.zipCode} {client.address.city}</div>
                  <div className="text-gray-500">{client.address.country}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(client.createdAt), 'dd MMMM yyyy', { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => onEdit(client)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsList;