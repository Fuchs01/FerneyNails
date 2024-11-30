import { Observable } from '@nativescript/core';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';

export class AppointmentsViewModel extends Observable {
  appointments: any[] = [];
  segments = [
    { title: "À venir" },
    { title: "Passés" }
  ];
  selectedIndex: number = 0;

  constructor() {
    super();
    this.loadAppointments();
  }

  async loadAppointments() {
    try {
      const api = ApiService.getInstance();
      const appointments = await api.getAppointments();
      
      // Trier et filtrer les rendez-vous
      const now = new Date();
      this.appointments = appointments.map(apt => ({
        ...apt,
        canCancel: new Date(apt.date) > now
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      this.notifyPropertyChange('appointments', this.appointments);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      alert('Impossible de charger les rendez-vous');
    }
  }

  async onCancelAppointment(args: any) {
    const appointment = args.object.bindingContext;
    
    try {
      const api = ApiService.getInstance();
      await api.cancelAppointment(appointment.id);
      await NotificationService.cancelAppointmentReminders(appointment.id);
      
      this.loadAppointments();
      alert('Rendez-vous annulé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert('Impossible d\'annuler le rendez-vous');
    }
  }

  onAddAppointment() {
    const frame = require('@nativescript/core').Frame;
    frame.topmost().navigate('views/book-appointment/book-appointment-page');
  }
}