import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoices, resendInvoice } from '../../services/invoiceService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const InvoicesPage = () => {
  const queryClient = useQueryClient();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const { data: invoices = [], isLoading, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  const resendMutation = useMutation({
    mutationFn: resendInvoice,
    onSuccess: () => {
      setSuccess('Facture renvoyée avec succès');
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: Error) => {
      setError(error.message);
      setSuccess(null);
    }
  });

  const handleResend = async (invoiceId: string) => {
    try {
      await resendMutation.mutateAsync(invoiceId);
    } catch (error) {
      // L'erreur est gérée par onError
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Factures</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
      </div>

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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Facture
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date et heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.serviceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.amount}€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(invoice.date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleResend(invoice.id)}
                    disabled={resendMutation.isPending}
                    className="text-pink-600 hover:text-pink-900 disabled:opacity-50"
                  >
                    {resendMutation.isPending ? 'Envoi...' : 'Renvoyer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesPage;