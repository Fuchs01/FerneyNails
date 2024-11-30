import { Observable } from '@nativescript/core';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

export class BookAppointmentViewModel extends Observable {
  services: any[] = [];
  selectedServiceIndex: number = -1;
  selectedDate: Date = new Date();
  selectedTime: string | null = null;
  availableSlots: string[] = [];
  isLoading: boolean = false;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  constructor() {
    super();
    this.maxDate.setMonth(this.maxDate.getMonth() + 2); // Réservation jusqu'à 2 mois
    this.loadServices();
  }

  async loadServices() {
    try {
      this.set('isLoading', true);
      const api = ApiService.getInstance();
      const services = await api.getServices();
      this.set('services', services);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      alert('Impossible de charger les services');
    } finally {
      this.set('isLoading', false);
    }
  }

  async loadAvailableSlots() {
    if (this.selectedServiceIndex === -1) return;

    try {
      this.set('isLoading', true);
      const api = ApiService.getInstance();
      const service = this.services[this.selectedServiceIndex];
      const date = this.selectedDate.toISOString().split('T')[0];
      
      const response = await api.getAvailableSlots(date, service.id);
      this.set('availableSlots', response.slots);
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
      alert('Impossible de charger les créneaux disponibles');
    } finally {
      this.set('isLoading', false);
    }
  }

  onTimeSelect(args: any) {
    const time = args.object.text;
    this.set('selectedTime', time);
  }

  get canBook(): boolean {
    return this.selectedServiceIndex !== -1 && 
           this.selectedDate !== null && 
           this.selectedTime !== null;
  }

  async onBookAppointment() {
    if (!this.canBook) return;

    try {
      this.set('isLoading', true);
      const api = ApiService.getInstance();
      const service = this.services[this.selectedServiceIndex];
      
      const appointmentData = {
        serviceId: service.id,
        date: this.selectedDate.toISOString().split('T')[0],
        time: this.selectedTime
      };

      const response = await api.bookAppointment(appointmentData);
      
      // Programmer les notifications de rappel
      await NotificationService.scheduleAppointmentReminder({
        ...response,
        serviceName: service.name
      });

      alert('Rendez-vous confirmé !');
      
      const frame = require('@nativescript/core').Frame;
      frame.topmost().navigate({
        moduleName: 'views/appointments/appointments-page',
        clearHistory: true
      });
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('Impossible de réserver le rendez-vous');
    } finally {
      this.set('isLoading', false);
    }
  }
}