import express from 'express';
import { readDb, writeDb } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Récupérer tous les clients
router.get('/', verifyToken, (req, res) => {
  try {
    const db = readDb();
    res.json(db.clients || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un client
router.post('/', verifyToken, (req, res) => {
  try {
    const db = readDb();
    
    // Vérifier si l'email existe déjà
    const existingClient = db.clients.find(c => c.email === req.body.email);
    if (existingClient) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const newClient = {
      id: `client${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    db.clients.push(newClient);
    
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(201).json(newClient);
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un client
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.clients.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    // Vérifier si le nouvel email existe déjà
    if (req.body.email !== db.clients[index].email) {
      const existingClient = db.clients.find(c => c.email === req.body.email);
      if (existingClient) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }

    // Conserver le mot de passe existant
    const currentPassword = db.clients[index].password;

    db.clients[index] = {
      ...db.clients[index],
      ...req.body,
      id,
      password: currentPassword,
      createdAt: db.clients[index].createdAt
    };

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.json(db.clients[index]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un client
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const index = db.clients.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    db.clients.splice(index, 1);

    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;