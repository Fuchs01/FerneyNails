import express from 'express';
import { readDb, writeDb } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Récupérer tous les services
router.get('/', (req, res) => {
  try {
    const db = readDb();
    const services = db.services || [];

    // Filtrer par catégorie si spécifié
    const { category, technique, minPrice, maxPrice, minDuration, maxDuration } = req.query;
    
    let filteredServices = [...services];

    if (category && category !== 'all') {
      filteredServices = filteredServices.filter(s => s.category === category);
    }

    if (technique && technique !== 'all') {
      filteredServices = filteredServices.filter(s => s.technique === technique);
    }

    if (minPrice) {
      filteredServices = filteredServices.filter(s => s.price >= Number(minPrice));
    }

    if (maxPrice) {
      filteredServices = filteredServices.filter(s => s.price <= Number(maxPrice));
    }

    if (minDuration) {
      filteredServices = filteredServices.filter(s => s.duration >= Number(minDuration));
    }

    if (maxDuration) {
      filteredServices = filteredServices.filter(s => s.duration <= Number(maxDuration));
    }

    res.json(filteredServices);
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les techniques disponibles par catégorie
router.get('/techniques/:category', (req, res) => {
  try {
    const { category } = req.params;
    let techniques = [];

    switch (category) {
      case 'nails':
        techniques = ['gel', 'semi-permanent', 'natural'];
        break;
      case 'hair':
        techniques = ['cut', 'color', 'brushing'];
        break;
      default:
        techniques = ['gel', 'semi-permanent', 'natural', 'cut', 'color', 'brushing'];
    }

    res.json(techniques);
  } catch (error) {
    console.error('Erreur lors de la récupération des techniques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un nouveau service (protégé)
router.post('/', verifyToken, (req, res) => {
  try {
    const db = readDb();
    const newService = {
      id: `service${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    if (!db.services) {
      db.services = [];
    }

    db.services.push(newService);
    
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(201).json(newService);
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un service (protégé)
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.services.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    db.services[index] = {
      ...db.services[index],
      ...req.body,
      id
    };

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.json(db.services[index]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un service (protégé)
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.services.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    db.services.splice(index, 1);

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;