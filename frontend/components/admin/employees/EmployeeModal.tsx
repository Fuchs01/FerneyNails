import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Employee } from '@/types';
import { format } from 'date-fns';

const employeeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  appRole: z.enum(['employe', 'administrateur']),
  speciality: z.enum(['onglerie', 'coiffure', 'les_deux']),
  schedule: z.record(z.object({
    enabled: z.boolean(),
    slots: z.array(z.object({
      start: z.string(),
      end: z.string()
    }))
  })),
  absences: z.array(z.object({
    start: z.string(),
    end: z.string(),
    reason: z.string()
  })).default([])
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface Props {
  employee?: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormData) => Promise<void>;
}

const defaultSchedule = {
  lundi: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '19:00' }] },
  mardi: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '19:00' }] },
  mercredi: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '19:00' }] },
  jeudi: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '19:00' }] },
  vendredi: { enabled: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '19:00' }] },
  samedi: { enabled: false, slots: [] },
  dimanche: { enabled: false, slots: [] }
};

const EmployeeModal: React.FC<Props> = ({ employee, isOpen, onClose, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);
  const [newAbsence, setNewAbsence] = useState({ start: '', end: '', reason: '' });

  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      appRole: 'employe',
      speciality: 'onglerie',
      schedule: defaultSchedule,
      absences: []
    }
  });

  // Mettre à jour le formulaire quand l'employé change
  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        appRole: employee.appRole,
        speciality: employee.speciality,
        schedule: employee.schedule,
        absences: employee.absences || []
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        appRole: 'employe',
        speciality: 'onglerie',
        schedule: defaultSchedule,
        absences: []
      });
    }
  }, [employee, reset]);

  const handleAddAbsence = () => {
    if (newAbsence.start && newAbsence.end && newAbsence.reason) {
      const currentAbsences = watch('absences') || [];
      setValue('absences', [...currentAbsences, newAbsence]);
      setNewAbsence({ start: '', end: '', reason: '' });
      setShowAbsenceForm(false);
    }
  };

  const handleRemoveAbsence = (index: number) => {
    const currentAbsences = watch('absences') || [];
    setValue('absences', currentAbsences.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await onSave(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {employee ? 'Modifier l\'employé' : 'Ajouter un employé'}
          </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <select
                {...register('appRole')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="employe">Employé</option>
                <option value="administrateur">Administrateur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Spécialité</label>
              <select
                {...register('speciality')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              >
                <option value="onglerie">Onglerie</option>
                <option value="coiffure">Coiffure</option>
                <option value="les_deux">Les deux</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Horaires de travail</h3>
            <div className="space-y-4">
              {Object.entries(defaultSchedule).map(([day, _]) => (
                <div key={day} className="flex items-start space-x-4">
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </label>
                    <Controller
                      name={`schedule.${day}.enabled`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-2"
                        />
                      )}
                    />
                  </div>
                  
                  <Controller
                    name={`schedule.${day}.slots`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex-1 space-y-2">
                        {field.value.map((slot, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => {
                                const newSlots = [...field.value];
                                newSlots[index] = { ...slot, start: e.target.value };
                                field.onChange(newSlots);
                              }}
                              className="w-32"
                            />
                            <span className="px-2">à</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => {
                                const newSlots = [...field.value];
                                newSlots[index] = { ...slot, end: e.target.value };
                                field.onChange(newSlots);
                              }}
                              className="w-32"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Absences</h3>
              <button
                type="button"
                onClick={() => setShowAbsenceForm(true)}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                + Ajouter une absence
              </button>
            </div>

            {showAbsenceForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <input
                      type="date"
                      value={newAbsence.start}
                      onChange={(e) => setNewAbsence({ ...newAbsence, start: e.target.value })}
                      className="mt-1 block w-full"
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <input
                      type="date"
                      value={newAbsence.end}
                      onChange={(e) => setNewAbsence({ ...newAbsence, end: e.target.value })}
                      className="mt-1 block w-full"
                      min={newAbsence.start || format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Motif</label>
                    <input
                      type="text"
                      value={newAbsence.reason}
                      onChange={(e) => setNewAbsence({ ...newAbsence, reason: e.target.value })}
                      className="mt-1 block w-full"
                      placeholder="Vacances, formation, etc."
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAbsenceForm(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleAddAbsence}
                    className="px-3 py-1 text-sm bg-pink-600 text-white rounded hover:bg-pink-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {watch('absences')?.map((absence, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <span className="font-medium">
                      {format(new Date(absence.start), 'dd/MM/yyyy')}
                      {' → '}
                      {format(new Date(absence.end), 'dd/MM/yyyy')}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {absence.reason}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAbsence(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : employee ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;