import React, { useState } from 'react';
import type { Appointment } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  appointments: Appointment[];
  onEditClick: (appointment: Appointment) => void;
}

const AppointmentsList: React.FC<Props> = ({ appointments, onEditClick }) => {
  const [statusMenuPosition, setStatusMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'cancelled':
        return 'Annulé';
      case 'no_show':
        return 'Pas venu';
      case 'paid':
        return 'Payé';
      default:
        return 'En attente';
    }
  };

  const handleStatusDoubleClick = (e: React.MouseEvent, appointment: Appointment) => {
    e.preventDefault();
    
    // Ne pas ouvrir le menu si le rendez-vous est annulé ou payé
    if (appointment.status === 'cancelled' || appointment.status === 'paid') {
      return;
    }

    // Position du menu contextuel
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    setStatusMenuPosition({
      x: rect.left,
      y: rect.top + scrollTop
    });
    setSelectedAppointment(appointment);
  };

  const handleStatusChange = (newStatus: 'paid' | 'no_show' | 'cancelled') => {
    if (selectedAppointment) {
      onEditClick({
        ...selectedAppointment,
        status: newStatus
      });
    }
    closeStatusMenu();
  };

  const closeStatusMenu = () => {
    setStatusMenuPosition(null);
    setSelectedAppointment(null);
  };

  // Fermer le menu si on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = () => closeStatusMenu();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employé
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(`${appointment.date}T${appointment.time}`), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{appointment.clientName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{appointment.serviceName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{appointment.employeeName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  onDoubleClick={(e) => handleStatusDoubleClick(e, appointment)}
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appointment.status === 'cancelled' || appointment.status === 'paid' 
                      ? '' 
                      : 'cursor-pointer'
                  } ${getStatusBadgeClass(appointment.status)}`}
                >
                  {getStatusText(appointment.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap space-x-2">
                {appointment.status !== 'cancelled' && appointment.status !== 'paid' && (
                  <button 
                    onClick={() => onEditClick(appointment)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Modifier
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Menu contextuel pour le changement de statut */}
      {statusMenuPosition && selectedAppointment && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          style={{
            top: `${statusMenuPosition.y + 20}px`,
            left: `${statusMenuPosition.x}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleStatusChange('paid')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Marquer comme payé
          </button>
          <button
            onClick={() => handleStatusChange('no_show')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Marquer comme non présenté
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
          >
            Annuler le rendez-vous
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;