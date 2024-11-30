import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  ChartBarIcon, 
  ArrowLeftOnRectangleIcon,
  ReceiptRefundIcon,
  Cog6ToothIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { 
  canViewFullDashboard, 
  canManageEmployees, 
  canManageSettings,
  canManageServices,
  canManageClients,
  canManageInvoices,
  canManageLoyalty,
  getCurrentUser
} from '@/services/authService';

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const user = getCurrentUser();
  const showFullDashboard = canViewFullDashboard();
  const showEmployees = canManageEmployees();
  const showSettings = canManageSettings();
  const showServices = canManageServices();
  const showClients = canManageClients();
  const showInvoices = canManageInvoices();
  const showLoyalty = canManageLoyalty();

  return (
    <aside className="w-64 bg-gray-800 text-white p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Ferneynails Admin</h1>
        <p className="text-sm text-gray-400 mt-1">
          {user?.name} ({user?.role === 'administrateur' ? 'Admin' : 
                        user?.role === 'gerant' ? 'Gérant' : 'Employé'})
        </p>
      </div>
      <nav className="space-y-2">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
          }
        >
          <ChartBarIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/admin/appointments" 
          className={({ isActive }) => 
            `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
          }
        >
          <CalendarIcon className="w-5 h-5" />
          <span>Rendez-vous</span>
        </NavLink>

        {showServices && (
          <NavLink 
            to="/admin/services" 
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
            }
          >
            <WrenchScrewdriverIcon className="w-5 h-5" />
            <span>Services</span>
          </NavLink>
        )}

        {showClients && (
          <NavLink 
            to="/admin/clients" 
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
            }
          >
            <UsersIcon className="w-5 h-5" />
            <span>Clients</span>
          </NavLink>
        )}

        {showInvoices && (
          <NavLink 
            to="/admin/invoices" 
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
            }
          >
            <ReceiptRefundIcon className="w-5 h-5" />
            <span>Factures</span>
          </NavLink>
        )}

        {showEmployees && (
          <NavLink 
            to="/admin/employees" 
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
            }
          >
            <UserGroupIcon className="w-5 h-5" />
            <span>Employés</span>
          </NavLink>
        )}

        {showLoyalty && (
          <NavLink 
            to="/admin/loyalty" 
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
            }
          >
            <UserGroupIcon className="w-5 h-5" />
            <span>Loyalty</span>
          </NavLink>
        )}        

        {showSettings && (
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded ${isActive ? 'bg-pink-600' : 'hover:bg-gray-700'}`
            }
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Paramètres</span>
          </NavLink>
        )}
      </nav>
      <div className="mt-auto pt-6">
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 p-2 w-full rounded hover:bg-gray-700 text-gray-300 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;