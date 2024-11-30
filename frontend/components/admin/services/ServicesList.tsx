import React from 'react';
import type { Service } from '@/types';

interface Props {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServicesList: React.FC<Props> = ({ services, onEdit, onDelete }) => {
  const getCategoryLabel = (category: string) => {
    return category === 'nails' ? 'Onglerie' : 'Coiffure';
  };

  const getTechniqueLabel = (technique: string) => {
    switch (technique) {
      case 'gel':
        return 'Gel';
      case 'semi-permanent':
        return 'Semi-permanent';
      case 'natural':
        return 'Naturel';
      case 'cut':
        return 'Coupe';
      case 'color':
        return 'Coloration';
      case 'brushing':
        return 'Brushing';
      default:
        return technique;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technique
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durée
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  service.category === 'nails' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {getCategoryLabel(service.category)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTechniqueLabel(service.technique)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {service.duration} min
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {service.price}€
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                  onClick={() => onEdit(service)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
                      onDelete(service.id);
                    }
                  }}
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

export default ServicesList;