import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@layouts/admin/AdminLayout';
import ClientLayout from '@layouts/client/ClientLayout';
import HomePage from '@pages/client/HomePage';
import LoginPage from '@pages/client/LoginPage';
import ServicesPage from '@pages/client/ServicesPage';
import RegisterPage from '@pages/client/RegisterPage';
import ProfilePage from '@pages/client/ProfilePage';
import AppointmentsPage from '@pages/client/AppointmentsPage';
import LoyaltyExplanation from '@pages/client/LoyaltyExplanation';
import AdminLoginPage from '@pages/admin/LoginPage';
import AdminDashboard from '@pages/admin/DashboardPage';
import AdminServicesPage from '@pages/admin/ServicesPage';
import AdminAppointmentsPage from '@pages/admin/AppointmentsPage';
import AdminEmployeesPage from '@pages/admin/EmployeesPage';
import AdminClientsPage from '@pages/admin/ClientsPage';
import AdminInvoicesPage from '@pages/admin/InvoicesPage';
import AdminSettingsPage from '@pages/admin/SettingsPage';
import AdminLoyaltyPage from '@pages/admin/LoyaltyPage';
import PrivateRoute from '@components/admin/PrivateRoute';
import ClientPrivateRoute from '@components/client/ClientPrivateRoute';


const App = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Routes>
      {/* Routes client */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ClientPrivateRoute><ProfilePage /></ClientPrivateRoute>} />
        <Route path="appointments" element={<ClientPrivateRoute><AppointmentsPage /></ClientPrivateRoute>} />
		<Route path="points" element={<LoyaltyExplanation />} />
      </Route>

      {/* Routes admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="services" element={<PrivateRoute requiredRole="gerant"><AdminServicesPage /></PrivateRoute>} />
        <Route path="employees" element={<PrivateRoute requiredRole="administrateur"><AdminEmployeesPage /></PrivateRoute>} />
        <Route path="clients" element={<PrivateRoute requiredRole="gerant"><AdminClientsPage /></PrivateRoute>} />
        <Route path="invoices" element={<PrivateRoute requiredRole="gerant"><AdminInvoicesPage /></PrivateRoute>} />
        <Route path="loyalty" element={<PrivateRoute requiredRole="gerant"><AdminLoyaltyPage /></PrivateRoute>} />
        <Route path="settings" element={<PrivateRoute requiredRole="administrateur"><AdminSettingsPage /></PrivateRoute>} />
      </Route>
      </Routes>
    </Suspense>
  );
};
export default App;