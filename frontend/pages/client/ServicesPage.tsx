import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/services/serviceService';
import { useNavigate } from 'react-router-dom';
import { isClientAuthenticated } from '@/services/clientAuthService';
import NewAppointmentModal from '@/components/client/appointments/NewAppointmentModal';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    technique: 'all',
    duration: 'all',
    priceRange: 'all'
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters)
  });

  const handleReservation = (serviceId: string) => {
    if (!isClientAuthenticated()) {
      navigate('/login', { state: { from: location.pathname, serviceId } });
      return;
    }
    setSelectedServiceId(serviceId);
    setIsModalOpen(true);
  };

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (filters.category !== 'all') {
      result = result.filter(service => service.category === filters.category);
    }

    if (filters.technique !== 'all') {
      result = result.filter(service => service.technique === filters.technique);
    }

    if (filters.duration !== 'all') {
      switch (filters.duration) {
        case 'short':
          result = result.filter(service => service.duration <= 30);
          break;
        case 'medium':
          result = result.filter(service => service.duration > 30 && service.duration <= 60);
          break;
        case 'long':
          result = result.filter(service => service.duration > 60);
          break;
      }
    }

    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'low':
          result = result.filter(service => service.price <= 30);
          break;
        case 'medium':
          result = result.filter(service => service.price > 30 && service.price <= 60);
          break;
        case 'high':
          result = result.filter(service => service.price > 60);
          break;
      }
    }

    return result;
  }, [services, filters]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Nos Services</h1>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full rounded-md"
          >
            <option value="all">Toutes les catégories</option>
            <option value="nails">Onglerie</option>
            <option value="hair">Coiffure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technique
          </label>
          <select
            value={filters.technique}
            onChange={(e) => setFilters(prev => ({ ...prev, technique: e.target.value }))}
            className="w-full rounded-md"
          >
            <option value="all">Toutes les techniques</option>
            {filters.category === 'nails' ? (
              <>
                <option value="gel">Gel</option>
                <option value="semi-permanent">Semi-permanent</option>
                <option value="natural">Naturel</option>
              </>
            ) : (
              <>
                <option value="cut">Coupe</option>
                <option value="color">Coloration</option>
                <option value="brushing">Brushing</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée
          </label>
          <select
            value={filters.duration}
            onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full rounded-md"
          >
            <option value="all">Toutes les durées</option>
            <option value="short">Court (≤ 30min)</option>
            <option value="medium">Moyen (30-60min)</option>
            <option value="long">Long (≥ 60min)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
            className="w-full rounded-md"
          >
            <option value="all">Tous les prix</option>
            <option value="low">≤ 30€</option>
            <option value="medium">30€ - 60€</option>
            <option value="high">≥ 60€</option>
          </select>
        </div>
      </div>

      {/* Liste des services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {service.image && (
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-pink-600">{service.price}€</span>
                <span className="text-gray-500">{service.duration} min</span>
              </div>
              <button
                onClick={() => handleReservation(service.id)}
                className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition-colors"
              >
                Réserver
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun service ne correspond à vos critères
        </div>
      )}

      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedServiceId(null);
        }}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
};

export default ServicesPage;