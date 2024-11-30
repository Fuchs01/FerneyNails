import express from 'express';
import { readDb, writeDb } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


// Route publique pour les informations publiques (horaires, contact)
router.get('/public', (req, res) => {
  try {
    const db = readDb();
    const publicSettings = {
      salonName: db.settings.salonName,
      contact: db.settings.contact,
      workingDays: db.settings.workingDays
    };
    res.json({ settings: publicSettings });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les paramètres
router.get('/', verifyToken , (req, res) => {
  try {
    const db = readDb();
    res.json({ settings: db.settings });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour les paramètres
router.put('/', verifyToken, (req, res) => {
  try {
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...req.body
    };

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.json({ settings: db.settings });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;