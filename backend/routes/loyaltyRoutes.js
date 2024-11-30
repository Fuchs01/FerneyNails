import express from 'express';
import { readDb, writeDb } from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user points
router.get('/points', verifyToken, async (req, res) => {
    try {
        const db = readDb();
        const userId = req.user.id;
        const user = db.clients.find(client => client.id === userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
    
        res.json({ points: user.points || 0 });
    } catch (error) {
        console.error(`Erreur dans GET /points : ${error.message}`);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
  
// Get points history
router.get('/history', verifyToken, async (req, res) => {
    try {
        const db = readDb();
        const userId = req.user.id;
        const pointsHistory = db.pointsHistory?.filter(h => h.userId === userId) || [];
        res.json(pointsHistory);
    } catch (error) {
        console.error(`Erreur dans GET /history : ${error.message}`);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});
  
// Redeem points
router.post('/redeem', verifyToken, async (req, res) => {
    try {
        const db = readDb();
        const userId = req.user.id;
        const { points, reward } = req.body;
        
        if (!points || points <= 0) {
            return res.status(400).json({ error: 'Nombre de points invalide' });
        }

        if (!reward) {
            return res.status(400).json({ error: 'Récompense non spécifiée' });
        }
        
        const userIndex = db.clients.findIndex(client => client.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
    
        const user = db.clients[userIndex];
        const currentPoints = user.points || 0;

        if (currentPoints < points) {
            return res.status(400).json({ error: 'Points insuffisants' });
        }
    
        // Update user points
        db.clients[userIndex].points = currentPoints - points;
    
        // Add to history
        if (!db.pointsHistory) {
            db.pointsHistory = [];
        }

        db.pointsHistory.push({
            userId,
            type: 'redeem',
            points: -points,
            reward,
            date: new Date().toISOString()
        });
    
        // Save changes
        if (!writeDb(db)) {
            throw new Error('Erreur lors de la sauvegarde des données');
        }

        res.json({ 
            message: 'Points échangés avec succès', 
            remainingPoints: db.clients[userIndex].points 
        });
    } catch (error) {
        console.error(`Erreur dans POST /redeem : ${error.message}`);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Add points (for admin/employee use)
router.post('/add', verifyToken, async (req, res) => {
    try {
        const db = readDb();
        const { clientId, points, reason } = req.body;
        
        if (!points || points <= 0) {
            return res.status(400).json({ error: 'Nombre de points invalide' });
        }

        // Check if user is admin or employee
        if (!req.user.isAdmin && !req.user.isEmployee) {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const userIndex = db.clients.findIndex(client => client.id === clientId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
    
        // Update user points
        db.clients[userIndex].points = (db.clients[userIndex].points || 0) + points;
    
        // Add to history
        if (!db.pointsHistory) {
            db.pointsHistory = [];
        }

        db.pointsHistory.push({
            userId: clientId,
            type: 'add',
            points,
            reason,
            addedBy: req.user.id,
            date: new Date().toISOString()
        });
    
        // Save changes
        if (!writeDb(db)) {
            throw new Error('Erreur lors de la sauvegarde des données');
        }

        res.json({ 
            message: 'Points ajoutés avec succès', 
            newTotal: db.clients[userIndex].points 
        });
    } catch (error) {
        console.error(`Erreur dans POST /add : ${error.message}`);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

export default router;