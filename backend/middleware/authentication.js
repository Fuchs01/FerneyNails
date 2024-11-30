import jwt from 'jsonwebtoken';

export const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }
  },

  requireAdmin: (req, res, next) => {
    if (req.user?.role !== 'administrateur') {
      return res.status(403).json({ message: 'Accès administrateur requis' });
    }
    next();
  }
};