import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings, type Settings } from '@/services/settingsService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const settingsSchema = z.object({
  salonName: z.string().min(1, 'Le nom du salon est requis'),
  contact: z.object({
    phone: z.string().min(1, 'Le téléphone est requis'),
    email: z.string().email('Email invalide'),
    address: z.string().min(1, 'L\'adresse est requise'),
    facebook: z.string().optional(),
    instagram: z.string().optional()
  }),
  smtp: z.object({
    host: z.string().min(1, 'L\'hôte SMTP est requis'),
    port: z.number().min(1, 'Le port SMTP est requis'),
    user: z.string().min(1, 'L\'utilisateur SMTP est requis'),
    pass: z.string().min(1, 'Le mot de passe SMTP est requis'),
    secure: z.boolean()
  })
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema)
  });

  // Mettre à jour le formulaire quand les données sont chargées
  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSuccess('Paramètres mis à jour avec succès');
      setError(null);
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: Error) => {
      setError(error.message);
      setSuccess(null);
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      // L'erreur est gérée par onError
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du salon
              </label>
              <input
                type="text"
                {...register('salonName')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.salonName && (
                <p className="mt-1 text-sm text-red-600">{errors.salonName.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                {...register('contact.phone')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.contact?.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('contact.email')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.contact?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                type="text"
                {...register('contact.address')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.contact?.address && (
                <p className="mt-1 text-sm text-red-600">{errors.contact.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                type="text"
                {...register('contact.facebook')}
                className="mt-1 block w-full rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="text"
                {...register('contact.instagram')}
                className="mt-1 block w-full rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Configuration SMTP</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hôte SMTP
              </label>
              <input
                type="text"
                {...register('smtp.host')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.smtp?.host && (
                <p className="mt-1 text-sm text-red-600">{errors.smtp.host.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Port SMTP
              </label>
              <input
                type="number"
                {...register('smtp.port', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md"
              />
              {errors.smtp?.port && (
                <p className="mt-1 text-sm text-red-600">{errors.smtp.port.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Utilisateur SMTP
              </label>
              <input
                type="text"
                {...register('smtp.user')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.smtp?.user && (
                <p className="mt-1 text-sm text-red-600">{errors.smtp.user.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe SMTP
              </label>
              <input
                type="password"
                {...register('smtp.pass')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.smtp?.pass && (
                <p className="mt-1 text-sm text-red-600">{errors.smtp.pass.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('smtp.secure')}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Utiliser une connexion sécurisée (SSL/TLS)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;