import { Application } from '@nativescript/core';
import { LocalNotifications } from '@nativescript/local-notifications';
import { StorageService } from './services/storage.service';

// Vérifier si l'utilisateur est connecté
const token = StorageService.getItem('auth_token');
const startPage = token ? 'views/appointments/appointments-page' : 'views/login/login-page';

// Initialiser les notifications locales
LocalNotifications.hasPermission()
  .then((granted) => {
    if (!granted) {
      LocalNotifications.requestPermission();
    }
  });

Application.run({ moduleName: startPage });