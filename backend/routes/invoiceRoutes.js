import express from 'express';
import { readDb } from '../db.js';
import { generateInvoice } from '../services/invoiceService.js';
import { sendInvoiceEmail } from '../services/emailService.js';

const router = express.Router();

// Récupérer toutes les factures
router.get('/', (req, res) => {
  try {
    const db = readDb();
    res.json(db.invoices || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Renvoyer une facture par email
router.post('/:id/resend', async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    
    // Trouver la facture
    const invoice = db.invoices.find(i => i.id === id);
    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    // Trouver le rendez-vous associé
    const appointment = db.appointments.find(a => a.id === invoice.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Trouver le service
    const service = db.services.find(s => s.id === invoice.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    // Trouver le client
    const client = db.clients.find(c => c.id === invoice.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    // Régénérer la facture
    const { html: invoiceHtml } = await generateInvoice({
      appointment,
      service,
      client: {
        name: `${client.firstName} ${client.lastName}`,
        email: client.email
      }
    });

    // Renvoyer l'email
    try {
      await sendInvoiceEmail({
        to: client.email,
        subject: 'Votre reçu Ferneynails (renvoi)',
        invoiceHtml
      });
      res.json({ message: 'Facture renvoyée avec succès' });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      res.status(500).json({ 
        message: 'Erreur lors de l\'envoi de l\'email',
        details: emailError.message 
      });
    }
  } catch (error) {
    console.error('Erreur lors du renvoi de la facture:', error);
    res.status(500).json({ 
      message: 'Erreur lors du renvoi de la facture',
      details: error.message 
    });
  }
});

export default router;