import express from 'express';
import { readDb, writeDb } from '../db.js';
import moment from 'moment';

const router = express.Router();

// Récupérer tous les employés (sauf admin)
router.get('/', (req, res) => {
  try {
    const db = readDb();
    const employees = (db.employees || []).filter(emp => emp.appRole !== 'administrateur');
    res.json(employees);
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un nouvel employé
router.post('/', (req, res) => {
  try {
    const db = readDb();
    const newEmployee = {
      id: `emp${Date.now()}`,
      ...req.body,
      password: 'password123' // Mot de passe par défaut
    };

    db.employees.push(newEmployee);
    
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Erreur lors de la création de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un employé
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.employees.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Conserver le mot de passe existant
    const currentPassword = db.employees[index].password;

    db.employees[index] = {
      ...db.employees[index],
      ...req.body,
      id,
      password: currentPassword
    };

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.json(db.employees[index]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un employé
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.employees.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    db.employees.splice(index, 1);

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'employé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les employés par spécialité
router.get('/by-speciality/:speciality', (req, res) => {
  try {
    const { speciality } = req.params;
    const db = readDb();
    
    const employees = db.employees.filter(employee => {
      return employee.appRole !== 'administrateur' && 
             (employee.speciality === 'les_deux' || employee.speciality === speciality);
    });

    res.json(employees);
  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Vérifier la disponibilité d'un employé
router.get('/:employeeId/availability', (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date, time } = req.query;
    const db = readDb();

    const employee = db.employees.find(e => e.id === employeeId);
    if (!employee || employee.appRole === 'administrateur') {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Vérifier le jour de la semaine
    const dayOfWeek = moment(date).locale('fr').format('dddd').toLowerCase();
    const daySchedule = employee.schedule[dayOfWeek];

    if (!daySchedule.enabled) {
      return res.json({ 
        available: false, 
        reason: 'L\'employé ne travaille pas ce jour' 
      });
    }

    // Vérifier les horaires de travail
    const requestedTime = moment(`${date}T${time}`);
    let withinWorkingHours = false;

    for (const slot of daySchedule.slots) {
      const slotStart = moment(`${date}T${slot.start}`);
      const slotEnd = moment(`${date}T${slot.end}`);
      
      if (requestedTime.isBetween(slotStart, slotEnd, undefined, '[]')) {
        withinWorkingHours = true;
        break;
      }
    }

    if (!withinWorkingHours) {
      return res.json({ 
        available: false, 
        reason: 'En dehors des horaires de travail' 
      });
    }

    // Vérifier les absences
    const isAbsent = employee.absences?.some(absence => {
      const absenceStart = moment(absence.start);
      const absenceEnd = moment(absence.end);
      return requestedTime.isBetween(absenceStart, absenceEnd, 'day', '[]');
    });

    if (isAbsent) {
      return res.json({ 
        available: false, 
        reason: 'L\'employé est absent à cette date' 
      });
    }

    // Vérifier les rendez-vous existants
    const appointments = db.appointments.filter(a => 
      a.employeeId === employeeId && 
      a.date === date &&
      a.status !== 'cancelled'
    );

    const hasConflict = appointments.some(apt => {
      const aptStart = moment(`${apt.date}T${apt.time}`);
      const aptEnd = moment(aptStart).add(apt.duration, 'minutes');
      const newStart = moment(`${date}T${time}`);
      const newEnd = moment(newStart).add(60, 'minutes');

      return (newStart.isBetween(aptStart, aptEnd, undefined, '[)') ||
              newEnd.isBetween(aptStart, aptEnd, undefined, '(]') ||
              (newStart.isSameOrBefore(aptStart) && newEnd.isSameOrAfter(aptEnd)));
    });

    if (hasConflict) {
      return res.json({ 
        available: false, 
        reason: 'L\'employé a déjà un rendez-vous sur ce créneau' 
      });
    }

    res.json({ available: true });
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;