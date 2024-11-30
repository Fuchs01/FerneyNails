import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LanguageSwitch from './LanguageSwitch';
import { getCurrentClient, logoutClient } from '@/services/clientAuthService';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
 const { t } = useTranslation();
 const queryClient = useQueryClient();
 const [isMenuOpen, setIsMenuOpen] = useState(false);

 const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAAEACAYAAAC010pkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAFckSURBVHhe7d2Hl5TVti58/pE7xvnOPfeeu/c5Zwez24xZDJhBURRzQjEBBkAxgagoRjCDEiSjiKCAASQpghJNKJhBDGDW9dVvdRU2TXV35dD9PmOU2NXd1VXvu54153xmWB1CgprHzz//HF5+eW4YM2ZM+Oyzz9LP5oYnn3wyHH74YeGTTz5JP7M9vv766zB//vzwzjvvhI8//jh+7e/98ccf6Z9IUItIiFsHWLFiRTj44IPCnnvuES699NKwefPX6e+0jocfHhH222/f8OGHH6af2R7jx4+Pr3vooYeEY445JnTpcnK45JKLw4033hCGDRsWRo8eHebMmRNWrVoVNmzYEIn9ww8/hN9++y39CgmqgYS4FYTFvmXL92HTpk3hyy+/CN98szn88ssv6e82D9bwwAM7hr32+lfYbbddwh13DMmZOGPGjA4HHLB/eP/999PPbI+77roz7LLLzuHMM88ML730UnjqqafC3XffHfr37xcuuujC0LVrlxShjw7HHXdsOP7448Ipp3QN559/frj66qvC0qVvpl/lT/z+++85faYExSEhbhnx448/Rhd10aJFYdSoUeG6664N3bufHk466aRwwgnHx3+vuurKlBv8cotEXL16dTjkkINDp05HhL333isSeMKECenvtoyxY8eGfffdJ6xcuSL9zJ/gDl9zzTWRuAMHDkw/2wDf4zJ/88034dNPP41utPcxb95r4ZlnxkVyL1++PP3Tf2Lp0qXhyiuvCNOmTUuschmRELeE4EKuXLkyTJo0MQwadFvKMp0XjjrqyFSMeXi0XIj7+OOPpxb/vPDWW29FMnNRuaojRoxodqFzczt2PCA8+OAD4bLLLg27775bisgHhYULF6Z/onlMnTo1/Otfe0ZCNQXL6PUQ96GHHko/Wxy49TYK7jlPIUF5kBC3hBg58sm4aFnHnj0vCffcc0+YNWtWeO+996Ll4kY2BWt80EEHRvK+8srL6We3B6t94IEHhuHDH4qvxW1FXha7udg1A39/zz13D0uWLE4/8ye2bt0azjvv3JT7vWuYOHFi+tni8Ouvv4a+ffuEnXfeKdx3373p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";

 const { data: client, isLoading } = useQuery({
   queryKey: ['currentClient'],
   queryFn: getCurrentClient,
   retry: false
 });

 const isAuthenticated = !!client;

 return (
   <header className="bg-white shadow-md">
     <div className="container mx-auto px-2 py-2 md:px-4 md:py-3">
       <div className="flex items-center gap-3 md:gap-6">
         <Link to="/" className="flex-shrink-0">
           <img 
             src={logoBase64}
             alt="FerneyNails Logo" 
             className="h-10 w-10 md:h-12 md:w-12"
           />
         </Link>
         <div className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
           <Link to="/services" className="text-gray-700 hover:text-pink-500 font-medium">
             {t('nav.services')}
           </Link>
           <Link to="/appointments" className="text-gray-700 hover:text-pink-500 font-medium whitespace-nowrap">
             {t('nav.appointments')}
           </Link>
           <div className="flex items-center gap-2">
             <button className="px-2 py-1 text-sm font-medium bg-pink-100 text-pink-600 rounded">
               FR
             </button>
             <button className="px-2 py-1 text-sm font-medium">
               EN
             </button>
           </div>
           {isAuthenticated ? (
             <div className="relative">
               <button 
                 className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:text-pink-500"
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
               >
                 <UserCircleIcon className="w-6 h-6 md:w-8 md:h-8" />
                 <span className="font-medium hidden md:inline">{client?.firstName}</span>
               </button>
               {isMenuOpen && (
                 <>
                   <div 
                     className="fixed inset-0 z-10"
                     onClick={() => setIsMenuOpen(false)}
                   />
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                     <Link
                       to="/profile"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       Mon profil
                     </Link>
                     <Link
                       to="/appointments"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       Mes rendez-vous
                     </Link>
					           <Link
                       to="/points"
                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                       onClick={() => setIsMenuOpen(false)}
                     >
                       Fidélité et Points
                     </Link>
                     <button
                       onClick={async () => {
                         setIsMenuOpen(false);
                         await logoutClient();
                         queryClient.setQueryData(['currentClient'], null);
                       }}
                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                     >
                       Déconnexion
                     </button>
                   </div>
                 </>
               )}
             </div>
           ) : (
             <div className="flex items-center gap-2 md:gap-3">
               <Link
                 to="/login"
                 className="text-gray-700 hover:text-pink-500 font-medium text-sm"
               >
                 Connexion
               </Link>
               <Link
                 to="/register"
                 className="bg-pink-600 text-white px-2 py-1 text-sm rounded hover:bg-pink-700"
               >
                 Inscription
               </Link>
             </div>
           )}
         </div>
       </div>
     </div>
   </header>
 );
};

export default Header;