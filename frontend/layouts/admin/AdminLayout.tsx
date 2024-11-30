import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { logout } from '@services/authService';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;