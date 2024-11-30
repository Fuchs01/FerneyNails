import express from 'express';
import jwt from 'jsonwebtoken';
import { readDb, writeDb } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Recherche de clients
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const db = readDb();
    const clients = db.clients || [];
    
    const matchingClients = clients.filter(client => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const searchStr = q.toLowerCase();
      return fullName.includes(searchStr) || 
             client.firstName.toLowerCase().includes(searchStr) || 
             client.lastName.toLowerCase().includes(searchStr);
    });

    res.json(matchingClients.map(client => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone
    })));
  } catch (error) {
    console.error('Erreur lors de la recherche des clients:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Inscription client
router.post('/register', async (req, res) => {
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

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: newClient.id,
        email: newClient.email,
        firstName: newClient.firstName,
        lastName: newClient.lastName
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newClient.id,
        firstName: newClient.firstName,
        lastName: newClient.lastName,
        email: newClient.email,
        phone: newClient.phone
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion client
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDb();
    
    const client = db.clients.find(c => c.email === email && c.password === password);
    if (!client) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { 
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        points: client.points || 0,  
        pointsHistory: client.pointsHistory || [] 
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les rendez-vous d'un client
router.get('/appointments', verifyToken, async (req, res) => {
  try {
    const clientId = req.user.id;
    const db = readDb();
    
    const appointments = db.appointments.filter(apt => 
      apt.clientId === clientId
    );

    res.json(appointments);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un nouveau rendez-vous
router.post('/appointments', verifyToken, async (req, res) => {
  try {
    const clientId = req.user.id;
    const db = readDb();
    
    const client = db.clients.find(c => c.id === clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    const newAppointment = {
      id: `apt${Date.now()}`,
      clientId,
      clientName: `${client.firstName} ${client.lastName}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newAppointment);
    
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Annuler un rendez-vous
router.post('/appointments/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user.id;
    const db = readDb();
    
    const appointmentIndex = db.appointments.findIndex(apt => 
      apt.id === id && apt.clientId === clientId
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier si le rendez-vous peut être annulé
    const appointment = db.appointments[appointmentIndex];
    if (appointment.status === 'cancelled' || appointment.status === 'paid') {
      return res.status(400).json({ 
        message: 'Ce rendez-vous ne peut pas être annulé' 
      });
    }

    // Mettre à jour le statut
    db.appointments[appointmentIndex] = {
      ...appointment,
      status: 'cancelled'
    };
    
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde');
    }

    res.json({ message: 'Rendez-vous annulé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'annulation du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les factures d'un client
router.get('/invoices', verifyToken, async (req, res) => {
  try {
    const clientId = req.user.id;
    const db = readDb();
    
    const invoices = db.invoices.filter(inv => 
      inv.clientId === clientId
    );

    res.json(invoices);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;