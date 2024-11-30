import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Service } from '@/types';

const serviceSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  category: z.enum(['nails', 'hair'], { required_error: 'La catégorie est requise' }),
  technique: z.string().min(1, 'La technique est requise'),
  duration: z.number().min(15, 'Minimum 15 minutes'),
  price: z.number().min(0, 'Le prix doit être positif'),
  description: z.string().min(1, 'La description est requise'),
  image: z.string().url('URL invalide').optional()
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Props {
  service?: Service;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => Promise<void>;
}

const ServiceModal: React.FC<Props> = ({ service, isOpen, onClose, onSave }) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      name: '',
      category: 'nails',
      technique: '',
      duration: 30,
      price: 0,
      description: '',
      image: ''
    }
  });

  const selectedCategory = watch('category');
  const imageUrl = watch('image');

  useEffect(() => {
    if (imageUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (service) {
      reset(service);
      setPreviewUrl(service.image || '');
    }
  }, [service, reset]);

  const onSubmit = async (data: ServiceFormData) => {
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
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {service ? 'Modifier le service' : 'Ajouter un service'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md"
              >
                <option value="nails">Onglerie</option>
                <option value="hair">Coiffure</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Technique</label>
              <select
                {...register('technique')}
                className="mt-1 block w-full rounded-md"
              >
                {selectedCategory === 'nails' ? (
                  <>
                    <option value="gel">Gel</option>
                    <option value="semi-permanent">Semi-permanent</option>
                    <option value="natural">Naturel</option>
                  </>
                ) : (
                  <>
                    <option value="cut">Coupe</option>
                    <option value="color">Coloration</option>
                    <option value="brushing">Brushing</option>
                  </>
                )}
              </select>
              {errors.technique && (
                <p className="mt-1 text-sm text-red-600">{errors.technique.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Durée (minutes)
              </label>
              <input
                type="number"
                {...register('duration', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md"
                min="15"
                step="5"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md"
                min="0"
                step="0.5"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                URL de l'image
              </label>
              <input
                type="url"
                {...register('image')}
                className="mt-1 block w-full rounded-md"
                placeholder="https://..."
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="h-32 w-auto object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
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
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : service ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;