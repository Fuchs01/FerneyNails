import { LocalNotifications } from '@nativescript/local-notifications';

export class NotificationService {
  static async scheduleAppointmentReminder(appointment: any) {
    const appointmentDate = new Date(appointment.date);
    // Rappel 24h avant
    const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);

    await LocalNotifications.schedule([{
      id: appointment.id,
      title: 'Rappel Rendez-vous',
      body: `Vous avez rendez-vous demain à ${appointment.time} pour ${appointment.serviceName}`,
      at: reminderDate,
      sound: true
    }]);

    // Rappel 1h avant
    const hourBefore = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
    await LocalNotifications.schedule([{
      id: appointment.id + 1000,
      title: 'Rendez-vous Imminent',
      body: `Votre rendez-vous est dans 1 heure pour ${appointment.serviceName}`,
      at: hourBefore,
      sound: true
    }]);
  }

  static async cancelAppointmentReminders(appointmentId: number) {
    await LocalNotifications.cancel(appointmentId);
    await LocalNotifications.cancel(appointmentId + 1000);
  }
}