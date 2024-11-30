import axios, { AxiosError } from 'axios';
import { StorageService } from './storage.service';

const API_URL = 'https://dev.fuchs-gva.ch/api';
const TOKEN_KEY = 'auth_token';

export class ApiService {
  private static instance: ApiService;
  private token: string | null = null;

  private constructor() {
    axios.defaults.baseURL = API_URL;
    this.token = StorageService.getItem(TOKEN_KEY);
    if (this.token) {
      this.setToken(this.token);
    }

    // Intercepteur pour gérer les erreurs réseau
    axios.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (!error.response) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        }
        if (error.response.status === 401) {
          StorageService.removeItem(TOKEN_KEY);
          // Rediriger vers la page de connexion
          const frame = require('@nativescript/core').Frame;
          frame.topmost().navigate({
            moduleName: 'views/login/login-page',
            clearHistory: true
          });
        }
        throw error;
      }
    );
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  setToken(token: string) {
    this.token = token;
    StorageService.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      }
      throw error;
    }
  }

  async getAppointments() {
    try {
      const response = await axios.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      throw new Error('Impossible de récupérer vos rendez-vous');
    }
  }

  async bookAppointment(appointmentData: any) {
    try {
      const response = await axios.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      throw new Error('Impossible de créer le rendez-vous');
    }
  }

  async cancelAppointment(id: string) {
    try {
      const response = await axios.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      throw new Error('Impossible d\'annuler le rendez-vous');
    }
  }

  async getServices() {
    try {
      const response = await axios.get('/services');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      throw new Error('Impossible de récupérer la liste des services');
    }
  }
}