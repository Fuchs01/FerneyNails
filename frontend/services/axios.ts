import axios from 'axios';

const isDevelopment = import.meta.env.DEV;

const baseURL = isDevelopment ? '/api' : '/api';

const instance = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Intercepteur pour ajouter le token aux requêtes
instance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const clientToken = localStorage.getItem('clientToken');
    
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (clientToken) {
      config.headers.Authorization = `Bearer ${clientToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Vérifier quel type d'utilisateur est connecté
      if (localStorage.getItem('adminToken')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.replace('/admin/login');
      } else if (localStorage.getItem('clientToken')) {
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientUser');
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;