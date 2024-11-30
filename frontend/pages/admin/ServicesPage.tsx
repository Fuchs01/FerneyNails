import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService } from '@/services/serviceService';
import ServicesList from '@/components/admin/services/ServicesList';
import ServiceModal from '@/components/admin/services/ServiceModal';
import type { Service } from '@/types';

const ServicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsModalOpen(false);
      setSelectedService(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsModalOpen(false);
      setSelectedService(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSave = async (data: any) => {
    try {
      setError(null);
      if (selectedService) {
        await updateMutation.mutateAsync({ id: selectedService.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (err) {
      // L'erreur est gérée par onError de la mutation
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      // L'erreur est gérée par onError de la mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services</h2>
        <button
          onClick={() => {
            setSelectedService(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Ajouter un service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <ServicesList
        services={services}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
          setError(null);
        }}
        service={selectedService}
        onSave={handleSave}
      />
    </div>
  );
};

export default ServicesPage;