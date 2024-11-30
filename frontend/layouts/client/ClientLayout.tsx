import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/client/Header';
import Footer from '../../components/client/Footer';

const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;