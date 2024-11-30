import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Appointment } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/services/serviceService';
import { getEmployeesBySpeciality, checkEmployeeAvailability } from '@/services/employeeService';
import { format, isBefore, startOfToday, parseISO, set } from 'date-fns';
import { fr } from 'date-fns/locale';

const appointmentSchema = z.object({
  serviceId: z.string().min(1, 'Service requis'),
  serviceName: z.string(),
  employeeId: z.string().min(1, 'Employé requis'),
  employeeName: z.string(),
  date: z.string().min(1, 'Date requise').refine((date) => {
    return !isBefore(parseISO(date), startOfToday());
  }, 'La date ne peut pas être dans le passé'),
  time: z.string().min(1, 'Heure requise'),
  duration: z.number().min(15, 'Durée minimum 15 minutes'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'no_show', 'paid']),
  notes: z.string().optional()
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface Props {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => Promise<void>;
}

const timeSlots = [
  ['09:00', '09:15', '09:30', '09:45'],
  ['10:00', '10:15', '10:30', '10:45'],
  ['11:00', '11:15', '11:30', '11:45'],
  ['14:00', '14:15', '14:30', '14:45'],
  ['15:00', '15:15', '15:30', '15:45'],
  ['16:00', '16:15', '16:30', '16:45'],
  ['17:00', '17:15', '17:30', '17:45']
];

const EditAppointmentModal: React.FC<Props> = ({ appointment, isOpen, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);
  const [timeSlotAvailability, setTimeSlotAvailability] = useState<Record<string, boolean>>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(appointment.employeeId);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      ...appointment
    }
  });

  const selectedServiceId = watch('serviceId');
  const selectedDate = watch('date');
  const currentStatus = watch('status');

  // Récupérer les services
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices
  });

  // Récupérer les employés pour la spécialité sélectionnée
  const { data: employees = [] } = useQuery({
    queryKey: ['employees', selectedSpeciality],
    queryFn: () => getEmployeesBySpeciality(selectedSpeciality),
    enabled: !!selectedSpeciality
  });

  // Empêcher le changement de statut de "payé" à "en attente"
  useEffect(() => {
    if (appointment.status === 'paid' && currentStatus === 'pending') {
      setValue('status', 'paid');
      setError('Impossible de changer le statut de payé à en attente');
    }
  }, [currentStatus, appointment.status, setValue]);

  // Mettre à jour la spécialité en fonction du service sélectionné
  useEffect(() => {
    if (selectedServiceId) {
      const service = services.find(s => s.id === selectedServiceId);
      if (service) {
        setValue('serviceName', service.name);
        setValue('duration', service.duration);
        const speciality = service.category === 'nails' ? 'onglerie' : 'coiffure';
        setSelectedSpeciality(speciality);
      }
    }
  }, [selectedServiceId, services, setValue]);

  // Vérifier la disponibilité des créneaux horaires
  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedEmployeeId || !selectedDate) {
        return;
      }

      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();

      const availability: Record<string, boolean> = {};
      
      for (const timeSlot of timeSlots.flat()) {
        // Si c'est aujourd'hui, désactiver les créneaux passés
        if (selectedDate === today) {
          const [hours, minutes] = timeSlot.split(':').map(Number);
          if (hours < currentHour || (hours === currentHour && minutes <= currentMinutes)) {
            availability[timeSlot] = false;
            continue;
          }
        }

        try {
          const result = await checkEmployeeAvailability(
            selectedEmployeeId,
            selectedDate,
            timeSlot
          );
          // Pour le créneau actuel du rendez-vous, le marquer comme disponible
          if (appointment.time === timeSlot && appointment.employeeId === selectedEmployeeId) {
            availability[timeSlot] = true;
          } else {
            availability[timeSlot] = result.available;
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de disponibilité:', error);
          availability[timeSlot] = false;
        }
      }

      setTimeSlotAvailability(availability);
    };

    checkAvailability();
  }, [selectedEmployeeId, selectedDate, appointment]);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setError(null);
      setIsSubmitting(true);

      // Vérifier si le rendez-vous est dans le passé
      const appointmentDate = set(parseISO(data.date), {
        hours: parseInt(data.time.split(':')[0]),
        minutes: parseInt(data.time.split(':')[1])
      });

      if (isBefore(appointmentDate, new Date())) {
        setError('Impossible de modifier un rendez-vous dans le passé');
        return;
      }

      // Vérifier la transition de statut invalide
      if (appointment.status === 'paid' && data.status === 'pending') {
        setError('Impossible de changer le statut de payé à en attente');
        return;
      }

      await onSave({
        ...appointment,
        ...data
      });
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Réinitialiser le formulaire à la fermeture
  useEffect(() => {
    if (!isOpen) {
      reset(appointment);
      setSelectedEmployeeId(appointment.employeeId);
      setTimeSlotAvailability({});
      setError(null);
    }
  }, [isOpen, reset, appointment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Modifier le rendez-vous</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Fermer</span>
            ×
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <input
              type="text"
              value={appointment.clientName}
              disabled
              className="w-full p-2 border rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              {...register('serviceId')}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={appointment.status === 'cancelled' || appointment.status === 'paid'}
            >
              <option value="">Sélectionnez un service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - {service.price}€
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
            <select
              {...register('employeeId')}
              onChange={(e) => {
                register('employeeId').onChange(e);
                setSelectedEmployeeId(e.target.value);
                const employee = employees.find(emp => emp.id === e.target.value);
                if (employee) {
                  setValue('employeeName', employee.name);
                }
              }}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={!selectedSpeciality || appointment.status === 'cancelled' || appointment.status === 'paid'}
            >
              <option value="">Sélectionnez un employé</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-600">{errors.employeeId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              {...register('date')}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              min={format(new Date(), 'yyyy-MM-dd')}
              disabled={appointment.status === 'cancelled' || appointment.status === 'paid'}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.flat().map((time) => {
                const isAvailable = timeSlotAvailability[time];
                const isCurrentTime = appointment.time === time && appointment.employeeId === selectedEmployeeId;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => (isAvailable || isCurrentTime) && setValue('time', time)}
                    disabled={(!isAvailable && !isCurrentTime) || !selectedEmployeeId || 
                             appointment.status === 'cancelled' || appointment.status === 'paid'}
                    className={`p-2 text-sm rounded-md ${
                      appointment.status === 'cancelled' || appointment.status === 'paid'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : !selectedEmployeeId
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : !isAvailable && !isCurrentTime
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : watch('time') === time
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
            {!selectedEmployeeId && (
              <p className="mt-1 text-sm text-gray-500">
                Sélectionnez un employé pour voir les créneaux disponibles
              </p>
            )}
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              {...register('status')}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={appointment.status === 'cancelled' || 
                       (appointment.status === 'paid' && currentStatus === 'pending')}
            >
              <option value="pending" disabled={appointment.status === 'paid'}>En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="cancelled">Annulé</option>
              <option value="no_show">Non présenté</option>
              <option value="paid">Payé</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={appointment.status === 'cancelled' || appointment.status === 'paid'}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || appointment.status === 'cancelled'}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;