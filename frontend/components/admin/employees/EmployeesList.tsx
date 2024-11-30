import React from 'react';
import type { Employee } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeesList: React.FC<Props> = ({ employees, onEdit, onDelete }) => {
  const getSpecialityLabel = (speciality: string) => {
    switch (speciality) {
      case 'onglerie':
        return 'Onglerie';
      case 'coiffure':
        return 'Coiffure';
      case 'les_deux':
        return 'Onglerie & Coiffure';
      default:
        return speciality;
    }
  };

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
              Spécialité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prochaine absence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => {
            const nextAbsence = employee.absences
              ?.filter(absence => new Date(absence.end) >= new Date())
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];

            return (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {employee.name}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div>{employee.email}</div>
                    <div className="text-gray-500">{employee.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.speciality === 'onglerie' ? 'bg-pink-100 text-pink-800' :
                    employee.speciality === 'coiffure' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {getSpecialityLabel(employee.speciality)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.appRole === 'administrateur' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {employee.appRole === 'administrateur' ? 'Administrateur' : 'Employé'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {nextAbsence ? (
                    <div className="text-sm">
                      <div>
                        {format(new Date(nextAbsence.start), 'dd/MM/yyyy', { locale: fr })}
                        {' → '}
                        {format(new Date(nextAbsence.end), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                      <div className="text-gray-500">{nextAbsence.reason}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Aucune absence prévue</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => onEdit(employee)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;