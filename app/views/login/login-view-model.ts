import { Observable } from '@nativescript/core';
import { ApiService } from '../../services/api.service';

export class LoginViewModel extends Observable {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor() {
    super();
  }

  async onLogin() {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.set('isLoading', true);

    try {
      const api = ApiService.getInstance();
      const response = await api.login(this.email, this.password);
      
      // Naviguer vers la page principale après connexion
      const frame = require('@nativescript/core').Frame;
      frame.topmost().navigate({
        moduleName: 'views/appointments/appointments-page',
        clearHistory: true
      });
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
    } finally {
      this.set('isLoading', false);
    }
  }
}