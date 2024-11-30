import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, createAppointment, updateAppointment } from '@/services/appointmentService';
import AppointmentsList from '@/components/admin/appointments/AppointmentsList';
import AppointmentsCalendar from '@/components/admin/appointments/AppointmentsCalendar';
import NewAppointmentModal from '@/components/admin/appointments/NewAppointmentModal';
import EditAppointmentModal from '@/components/admin/appointments/EditAppointmentModal';
import type { Appointment } from '@/types';

const AppointmentsPage: React.FC = () => {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const queryClient = useQueryClient();

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
    refetchInterval: 30000 // Rafraîchir toutes les 30 secondes
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Appointment, 'id' | 'createdAt'>) => 
      createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
      updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const handleCreateAppointment = async (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      await createMutation.mutateAsync(data);
      setIsNewModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      throw error;
    }
  };

  const handleUpdateAppointment = async (appointment: Appointment) => {
    try {
      await updateMutation.mutateAsync({
        id: appointment.id,
        data: appointment
      });
      setIsEditModalOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      throw error;
    }
  };

  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rendez-vous</h2>
        <div className="flex space-x-4">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                view === 'list'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                view === 'calendar'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:text-gray-900'
              }`}
            >
              Calendrier
            </button>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Nouveau rendez-vous
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <AppointmentsList 
          appointments={appointments}
          onEditClick={handleEditClick}
        />
      ) : (
        <AppointmentsCalendar 
          appointments={appointments}
          onEditClick={handleEditClick}
        />
      )}
      
      <NewAppointmentModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleCreateAppointment}
      />

      {selectedAppointment && (
        <EditAppointmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointment={selectedAppointment}
          onSave={handleUpdateAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;