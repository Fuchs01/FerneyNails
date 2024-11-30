import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Client } from '@/types';

const clientSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  address: z.object({
    street: z.string().min(1, 'La rue est requise'),
    city: z.string().min(1, 'La ville est requise'),
    zipCode: z.string().min(1, 'Le code postal est requis'),
    country: z.string().min(1, 'Le pays est requis')
  })
});

type ClientFormData = z.infer<typeof clientSchema>;

interface Props {
  client?: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => Promise<void>;
}

const ClientModal: React.FC<Props> = ({ client, isOpen, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        zipCode: '',
        country: 'France'
      }
    }
  });

  useEffect(() => {
    if (client) {
      reset(client);
    }
  }, [client, reset]);

  const onSubmit = async (data: ClientFormData) => {
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
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {client ? 'Modifier le client' : 'Ajouter un client'}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                {...register('firstName')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                {...register('lastName')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md"
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
              className="mt-1 block w-full rounded-md"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {!client && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Adresse</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Rue</label>
              <input
                type="text"
                {...register('address.street')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.address?.street && (
                <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  {...register('address.city')}
                  className="mt-1 block w-full rounded-md"
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input
                  type="text"
                  {...register('address.zipCode')}
                  className="mt-1 block w-full rounded-md"
                />
                {errors.address?.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pays</label>
              <input
                type="text"
                {...register('address.country')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.address?.country && (
                <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
              )}
            </div>
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Enregistrement...' : client ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;