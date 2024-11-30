import nodemailer from 'nodemailer';
import { readDb } from '../db.js';

const isDevelopment = process.env.NODE_ENV === 'development';

const createTransporter = () => {
  try {
    if (isDevelopment) {
      // En développement, utiliser un transporteur de test qui simule l'envoi
      return {
        sendMail: async (mailOptions) => {
          console.log('📧 Email simulé en mode développement:');
          console.log('De:', mailOptions.from);
          console.log('À:', mailOptions.to);
          console.log('Sujet:', mailOptions.subject);
          console.log('Contenu HTML:', mailOptions.html.substring(0, 150) + '...');
          return { messageId: 'test-' + Date.now() };
        },
        verify: (callback) => callback(null, true)
      };
    }

    // En production, utiliser la vraie configuration SMTP
    const db = readDb();
    const smtpConfig = db.settings.smtp;

    if (!smtpConfig) {
      throw new Error('Configuration SMTP non trouvée dans la base de données');
    }

    const config = {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    return nodemailer.createTransport(config);
  } catch (error) {
    console.error('Erreur lors de la création du transporteur:', error);
    throw error;
  }
};

let transporter = null;

const initializeTransporter = () => {
  if (!transporter) {
    try {
      transporter = createTransporter();
      console.log('Transporteur email initialisé en mode', isDevelopment ? 'développement' : 'production');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du transporteur:', error);
      throw error;
    }
  }
  return transporter;
};

export const sendInvoiceEmail = async ({ to, subject, invoiceHtml }) => {
  try {
    const transport = initializeTransporter();
    const db = readDb();
    const smtpConfig = db.settings.smtp;
    
    if (!transport) {
      throw new Error('Le transporteur n\'est pas initialisé');
    }

    console.log('Tentative d\'envoi d\'email à:', to);
    
    const info = await transport.sendMail({
      from: `"Ferneynails" <${isDevelopment ? 'dev@ferneynails.fr' : smtpConfig.user}>`,
      to,
      subject,
      html: invoiceHtml
    });

    console.log('Email traité avec succès:', info);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    if (!isDevelopment && (error.code === 'ECONNREFUSED' || error.code === 'ESOCKET')) {
      transporter = null;
      console.log('Transporteur réinitialisé suite à une erreur de connexion');
    }
    
    throw new Error(`Erreur d'envoi d'email: ${error.message}`);
  }
};

// Vérifier la configuration au démarrage
try {
  const transport = initializeTransporter();
  transport.verify((error) => {
    if (error) {
      console.error('Erreur de vérification du transporteur:', error);
    } else {
      console.log('Service email prêt en mode', isDevelopment ? 'développement' : 'production');
    }
  });
} catch (error) {
  console.error('Erreur lors de l\'initialisation du service email:', error);
}