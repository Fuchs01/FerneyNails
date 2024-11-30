import express from 'express';
import { readDb, writeDb } from '../db.js';
import moment from 'moment';
import { generateInvoice } from '../services/invoiceService.js';
import { sendInvoiceEmail } from '../services/emailService.js';

const router = express.Router();

// Récupérer tous les rendez-vous
router.get('/', (req, res) => {
  try {
    const db = readDb();
    res.json(db.appointments || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un rendez-vous
router.put('/:id', async (req, res) => {
  try {
    const db = readDb();
    const appointments = db.appointments || [];
    const index = appointments.findIndex(a => a.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    const currentAppointment = appointments[index];

    // Vérifier les transitions de statut invalides
    if (currentAppointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Impossible de modifier un rendez-vous annulé' });
    }

    if (currentAppointment.status === 'paid' && req.body.status === 'pending') {
      return res.status(400).json({ message: 'Impossible de changer le statut de payé à en attente' });
    }

    // Si le statut passe à "paid", générer et envoyer la facture
    if (req.body.status === 'paid' && currentAppointment.status !== 'paid') {
      try {
        const service = db.services.find(s => s.id === currentAppointment.serviceId);
        if (!service) {
          throw new Error('Service non trouvé');
        }

        // Trouver le client correspondant
        const client = db.clients.find(c => c.id === currentAppointment.clientId);
        if (!client) {
          throw new Error('Client non trouvé');
        }

        // Calculer les points de fidélité
        const pointsEarned = Math.floor(service.price * (db.settings.loyalty.pointsPerEuro || 1));
        client.points = (client.points || 0) + pointsEarned;

        // Ajouter l'historique des points
        if (!client.pointsHistory) {
          client.pointsHistory = [];
        }
        client.pointsHistory.push({
          date: new Date().toISOString(),
          amount: pointsEarned,
          type: 'earned',
          description: service.name
        });


        // Générer la facture
        const { invoiceNumber, html: invoiceHtml } = await generateInvoice({
          appointment: currentAppointment,
          service,
          client: {
            name: `${client.firstName} ${client.lastName}`,
            email: client.email
          }
        });

        // Tenter d'envoyer l'email
        try {
          await sendInvoiceEmail({
            to: client.email,
            subject: 'Votre reçu Ferneynails',
            invoiceHtml
          });
          console.log('Email envoyé avec succès à:', client.email);
        } catch (emailError) {
          console.warn('Échec de l\'envoi de l\'email:', emailError.message);
          // Ne pas bloquer la mise à jour du rendez-vous si l'email échoue
        }

        // Ajouter le numéro de facture au rendez-vous
        req.body.invoiceNumber = invoiceNumber;
      } catch (error) {
        console.error('Erreur détaillée lors de la génération/envoi de la facture:', error);
        return res.status(500).json({ 
          message: 'Erreur lors de la génération de la facture',
          details: error.message 
        });
      }
    }

    // Mettre à jour le rendez-vous
    appointments[index] = {
      ...currentAppointment,
      ...req.body,
      id: req.params.id
    };
    
    db.appointments = appointments;
    
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde des modifications');
    }

    res.json(appointments[index]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      details: error.message 
    });
  }
});

export default router;