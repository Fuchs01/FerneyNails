import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientAppointments, cancelAppointment } from '@/services/clientAppointmentService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import NewAppointmentModal from '@/components/client/appointments/NewAppointmentModal';
import { getCurrentClient } from '@/services/clientAuthService';
import { useNavigate } from 'react-router-dom';

const AppointmentsPage = () => {
 const [isModalOpen, setIsModalOpen] = React.useState(false);
 const queryClient = useQueryClient();
 const navigate = useNavigate();

 const { data: client, isLoading: isLoadingClient } = useQuery({
   queryKey: ['currentClient'],
   queryFn: getCurrentClient,
   retry: false
 });

 const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
   queryKey: ['clientAppointments'],
   queryFn: getClientAppointments,
   enabled: !!client
 });

 React.useEffect(() => {
   if (!isLoadingClient && !client) {
     navigate('/login');
   }
 }, [client, isLoadingClient, navigate]);

 const cancelMutation = useMutation({
   mutationFn: cancelAppointment,
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['clientAppointments'] });
   }
 });

 // Gestionnaire de fermeture de modal qui rafraîchit les données
 const handleModalClose = async () => {
   await queryClient.invalidateQueries({ queryKey: ['clientAppointments'] });
   setIsModalOpen(false);
 };

 if (isLoadingClient || isLoadingAppointments) {
   return <div className="container mx-auto px-4 py-8">Chargement...</div>;
 }

 const handleCancel = async (id: string) => {
   if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
     try {
       await cancelMutation.mutateAsync(id);
     } catch (error) {
       console.error('Erreur lors de l\'annulation:', error);
     }
   }
 };

 const getStatusBadgeClass = (status: string) => {
   switch (status) {
     case 'confirmed':
       return 'bg-green-100 text-green-800';
     case 'cancelled':
       return 'bg-red-100 text-red-800';
     case 'paid':
       return 'bg-blue-100 text-blue-800';
     default:
       return 'bg-yellow-100 text-yellow-800';
   }
 };

 const getStatusText = (status: string) => {
   switch (status) {
     case 'confirmed':
       return 'Confirmé';
     case 'cancelled':
       return 'Annulé';
     case 'paid':
       return 'Payé';
     default:
       return 'En attente';
   }
 };

 return (
   <div className="container mx-auto px-4 py-8">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">Mes rendez-vous</h1>
       <button
         onClick={() => setIsModalOpen(true)}
         className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
       >
         Nouveau rendez-vous
       </button>
     </div>

     <div className="bg-white shadow-md rounded-lg overflow-hidden">
       <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Date
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Service
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Employé
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Statut
             </th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Actions
             </th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
           {appointments.map((appointment) => (
             <tr key={appointment.id}>
               <td className="px-6 py-4 whitespace-nowrap">
                 {format(new Date(`${appointment.date}T${appointment.time}`), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 {appointment.serviceName}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 {appointment.employeeName}
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                   {getStatusText(appointment.status)}
                 </span>
               </td>
               <td className="px-6 py-4 whitespace-nowrap">
                 {appointment.status !== 'cancelled' && appointment.status !== 'paid' && (
                   <button
                     onClick={() => handleCancel(appointment.id)}
                     className="text-red-600 hover:text-red-900"
                   >
                     Annuler
                   </button>
                 )}
                 {appointment.status === 'paid' && appointment.invoiceUrl && (
                   <a>
                     href={appointment.invoiceUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:text-blue-900"
                   
                     Voir la facture
                   </a>
                 )}
               </td>
             </tr>
           ))}
           {appointments.length === 0 && (
             <tr>
               <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                 Vous n'avez pas encore de rendez-vous
               </td>
             </tr>
           )}
         </tbody>
       </table>
     </div>

     <NewAppointmentModal
       isOpen={isModalOpen}
       onClose={handleModalClose}
     />
   </div>
 );
};

export default AppointmentsPage;