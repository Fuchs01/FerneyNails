// Importation des dépendances React et des icônes Lucide
import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';  

// Interface définissant la structure des données de configuration
interface Settings {
 // Informations de contact
 contact: {
   phone: string;
   email: string;
   address: string;
   facebook: string;
   instagram: string;
 };
 salonName: string;
 // Structure des horaires d'ouverture
 workingDays: {
   [key: string]: {
     enabled: boolean; // Si le jour est ouvert
     slots: Array<{ // Créneaux horaires de la journée
       start: string;
       end: string;
     }>;
   };
 };
}

const Footer: React.FC = () => {
 // État local pour stocker les paramètres
 const [settings, setSettings] = useState<Settings | null>(null);

 // Effet pour charger les données au montage du composant
 useEffect(() => {
   const fetchSettings = async () => {
     try {
       const response = await fetch('/api/settings/public');
       const data = await response.json();
       setSettings(data.settings);
     } catch (error) {
       console.error('Erreur:', error);
     }
   };
   fetchSettings();
 }, []);

 // Formate les heures d'ouverture pour l'affichage
 const formatWorkingHours = (day: any) => {
   if (!day?.enabled) return 'Fermé';
   if (!day?.slots?.length) return 'Fermé';
   return day.slots.map((slot: any) => `${slot.start} - ${slot.end}`).join(', ');
 };

 // Récupère les horaires pour un jour donné
 const getDaySchedule = (dayKey: string) => {
   const day = settings?.workingDays?.[dayKey.toLowerCase()];
   return formatWorkingHours(day);
 };

 return (
   <footer className="bg-gray-900">
     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Section Contact */}
         <div>
           <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
           <div className="space-y-3">
             {/* Téléphone */}
             <div className="flex items-center text-gray-300">
               <Phone className="h-5 w-5 mr-2" />
               <span>{settings?.contact?.phone || ''}</span>
             </div>
             {/* Email */}
             <div className="flex items-center text-gray-300">
               <Mail className="h-5 w-5 mr-2" />
               <span>{settings?.contact?.email || ''}</span>
             </div>
             {/* Adresse */}
             <div className="flex items-center text-gray-300">
               <MapPin className="h-5 w-5 mr-2" />
               <span>{settings?.contact?.address || ''}</span>
             </div>
           </div>
         </div>

         {/* Section Horaires */}
         <div>
           <h3 className="text-white text-lg font-semibold mb-4">Horaires</h3>
           <div className="space-y-2 text-gray-300">
             <div className="flex justify-between">
               <span>Lundi :</span>
               <span>{getDaySchedule('lundi')}</span>
             </div>
             <div className="flex justify-between">
               <span>Mardi :</span>
               <span>{getDaySchedule('mardi')}</span>
             </div>
             <div className="flex justify-between">
               <span>Mercredi :</span>
               <span>{getDaySchedule('mercredi')}</span>
             </div>
             <div className="flex justify-between">
               <span>Jeudi :</span>
               <span>{getDaySchedule('jeudi')}</span>
             </div>
             <div className="flex justify-between">
               <span>Vendredi :</span>
               <span>{getDaySchedule('vendredi')}</span>
             </div>
             <div className="flex justify-between">
               <span>Samedi :</span>
               <span>{getDaySchedule('samedi')}</span>
             </div>
             <div className="flex justify-between">
               <span>Dimanche :</span>
               <span>{getDaySchedule('dimanche')}</span>
             </div>
           </div>
         </div>

         {/* Section Réseaux Sociaux */}
         <div>
           <h3 className="text-white text-lg font-semibold mb-4">Suivez-nous</h3>
           <div className="flex space-x-4">
             {settings?.contact?.facebook && (
               <a href={settings.contact.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                 <span className="sr-only">Facebook</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                   <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                 </svg>
               </a>
             )}
             {settings?.contact?.instagram && (
               <a href={settings.contact.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                 <span className="sr-only">Instagram</span>
                 <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                   <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                 </svg>
               </a>
             )}
           </div>
         </div>
       </div>
       
       {/* Pied de page avec copyright */}
       <div className="mt-8 border-t border-gray-700 pt-8">
         <p className="text-center text-gray-400">
           © {new Date().getFullYear()} {settings?.salonName}. Tous droits réservés.
         </p>
       </div>
     </div>
   </footer>
 );
};

export default Footer;