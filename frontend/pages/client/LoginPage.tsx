import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginClient, getCurrentClient } from '@/services/clientAuthService';
import { useQueryClient } from '@tanstack/react-query';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient(); // Utilisez useQueryClient au lieu de créer une nouvelle instance

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      // Connexion et récupération du token
      const response = await loginClient(data);
      
      // Stocker le token dans localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      // Récupérer les données du client
      const clientData = await getCurrentClient();
      
      // Mettre à jour le cache React Query
      await queryClient.setQueryData(['currentClient'], clientData);
      
      // Invalider la requête pour forcer un rafraîchissement
      await queryClient.invalidateQueries({ queryKey: ['currentClient'] });

      const from = (location.state as any)?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Identifiants invalides');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-pink-600 hover:text-pink-700">
              S'inscrire
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              placeholder="votre@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;