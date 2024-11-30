import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import type { Appointment } from '../../../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

interface Props {
  appointments: Appointment[];
  onEditClick: (appointment: Appointment) => void;
}

const AppointmentsCalendar: React.FC<Props> = ({ appointments, onEditClick }) => {
  const events = appointments.map(appointment => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + appointment.duration * 60000);
    
    return {
      id: appointment.id,
      title: `${appointment.clientName} - ${appointment.serviceName} (${appointment.status === 'cancelled' ? 'Annulé' : 
             appointment.status === 'paid' ? 'Payé' : 
             appointment.status === 'no_show' ? 'Non présenté' : 
             appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'})`,
      start: startDate,
      end: endDate,
      resource: appointment,
      allDay: false
    };
  });

  const handleEventDoubleClick = (event: any) => {
    // Empêcher la modification des rendez-vous annulés
    if (event.resource.status === 'cancelled') {
      return;
    }
    onEditClick(event.resource);
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#EC4899'; // Rose par défaut pour l'onglerie
    let opacity = 1;

    // Vérifier si le service commence par "Coupe" ou "Color" pour la coiffure
    if (event.resource.serviceName.startsWith('Coupe') || 
        event.resource.serviceName.startsWith('Color')) {
      backgroundColor = '#8B5CF6'; // Violet pour la coiffure
    }

    // Statuts
    switch (event.resource.status) {
      case 'cancelled':
        backgroundColor = '#9CA3AF'; // Gris pour annulé
        opacity = 0.6;
        break;
      case 'paid':
        backgroundColor = '#10B981'; // Vert pour payé
        break;
      case 'no_show':
        backgroundColor = '#EF4444'; // Rouge pour non présenté
        opacity = 0.8;
        break;
      case 'pending':
        opacity = 0.8;
        break;
    }

    return {
      style: {
        backgroundColor,
        opacity,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '2px 5px',
        fontSize: '0.875rem',
        cursor: event.resource.status === 'cancelled' ? 'not-allowed' : 'pointer'
      }
    };
  };

  const formats = {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
      return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
    },
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
      return `${moment(start).format('D MMMM')} - ${moment(end).format('D MMMM YYYY')}`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          defaultView="week"
          formats={formats}
          eventPropGetter={eventStyleGetter}
          onDoubleClickEvent={handleEventDoubleClick}
          tooltipAccessor={(event: any) => 
            `${event.resource.clientName}\n${event.resource.serviceName}\nEmployé: ${event.resource.employeeName}\nStatut: ${
              event.resource.status === 'cancelled' ? 'Annulé' :
              event.resource.status === 'paid' ? 'Payé' :
              event.resource.status === 'no_show' ? 'Non présenté' :
              event.resource.status === 'confirmed' ? 'Confirmé' : 'En attente'
            }`
          }
          messages={{
            week: 'Semaine',
            day: 'Jour',
            month: 'Mois',
            previous: 'Précédent',
            next: 'Suivant',
            today: 'Aujourd\'hui',
            agenda: 'Agenda',
            showMore: total => `+ ${total} autres`
          }}
          step={15}
          timeslots={1}
          min={moment().set('hour', 8).set('minute', 0).toDate()}
          max={moment().set('hour', 20).set('minute', 0).toDate()}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#EC4899]"></div>
          <span>Onglerie</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#8B5CF6]"></div>
          <span>Coiffure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#10B981]"></div>
          <span>Payé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#9CA3AF] opacity-60"></div>
          <span>Annulé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#EF4444] opacity-80"></div>
          <span>Non présenté</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsCalendar;