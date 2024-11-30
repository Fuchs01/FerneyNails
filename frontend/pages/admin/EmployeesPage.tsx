import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/services/employeeService';
import EmployeesList from '@/components/admin/employees/EmployeesList';
import EmployeeModal from '@/components/admin/employees/EmployeeModal';
import type { Employee } from '@/types';

const EmployeesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsModalOpen(false);
      setSelectedEmployee(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsModalOpen(false);
      setSelectedEmployee(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error: Error) => {
      setError(error.message);
    }
  });

  const handleSave = async (data: any) => {
    try {
      setError(null);
      if (selectedEmployee) {
        await updateMutation.mutateAsync({ id: selectedEmployee.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (err) {
      // L'erreur est gérée par onError de la mutation
    }
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        // L'erreur est gérée par onError de la mutation
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employés</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          Ajouter un employé
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <EmployeesList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employee={selectedEmployee}
        onSave={handleSave}
      />
    </div>
  );
};

export default EmployeesPage;