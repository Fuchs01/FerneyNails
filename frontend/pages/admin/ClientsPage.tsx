import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, updateClient, deleteClient } from '@/services/adminClientService';
import ClientsList from '@/components/admin/clients/ClientsList';
import ClientModal from '@/components/admin/clients/ClientModal';
import type { Client } from '@/types';

const ClientsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setSelectedClient(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsModalOpen(false);
      setSelectedClient(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSave = async (data: any) => {
    try {
      setError(null);
      if (selectedClient) {
        await updateMutation.mutateAsync({ id: selectedClient.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (err) {
      // L'erreur est gérée par onError de la mutation
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        // L'erreur est gérée par onError de la mutation
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Ajouter un client
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <ClientsList
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
        onSave={handleSave}
      />
    </div>
  );
};

export default ClientsPage;