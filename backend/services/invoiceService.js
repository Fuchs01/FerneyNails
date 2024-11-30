import moment from 'moment';
import { readDb, writeDb } from '../db.js';

// Générer un numéro de facture unique
const generateInvoiceNumber = () => {
  const year = moment().format('YYYY');
  const month = moment().format('MM');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `F${year}${month}${random}`;
};

// Générer le contenu HTML du reçu
const generateInvoiceHtml = (data) => {
  const { 
    invoiceNumber, 
    date, 
    client, 
    service,
    amount
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 30px; }
        .client-details { margin-bottom: 30px; }
        .service-details { margin-bottom: 30px; }
        .total { text-align: right; font-size: 1.2em; margin-top: 30px; }
        .footer { text-align: center; margin-top: 50px; font-size: 0.9em; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ferneynails</h1>
          <p>13B Chemin du Levant<br>F-01210 Ferney-Voltaire</p>
        </div>

        <div class="invoice-details">
          <h2>Reçu N° ${invoiceNumber}</h2>
          <p>Date : ${moment(date).format('DD/MM/YYYY')}</p>
        </div>

        <div class="client-details">
          <h3>Client</h3>
          <p>${client.name}<br>
          ${client.email}</p>
        </div>

        <div class="service-details">
          <table>
            <thead>
              <tr>
                <th>Prestation</th>
                <th>Durée</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${service.name}</td>
                <td>${service.duration} min</td>
                <td>${service.price.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="total">
          <p><strong>Total : ${amount.toFixed(2)} €</strong></p>
        </div>

        <div class="footer">
          <p>Merci de votre confiance !</p>
          <p>
            Ferneynails - SIRET: 902 142 678 00017<br>
            Tél: +33 6 07 08 57 95 - Email: contact@ferneynails.fr
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateInvoice = async (appointmentData) => {
  try {
    const { appointment, service, client } = appointmentData;
    
    if (!service || !client) {
      throw new Error('Données manquantes pour la génération de la facture');
    }

    console.log('Données reçues pour la génération de facture:', {
      appointmentId: appointment.id,
      clientName: client.name,
      clientEmail: client.email,
      serviceName: service.name,
      servicePrice: service.price
    });
    
    // Générer un numéro de facture unique
    const invoiceNumber = generateInvoiceNumber();
    
    // Créer les données de la facture
    const invoiceData = {
      invoiceNumber,
      date: new Date(),
      client,
      service,
      amount: service.price
    };

    // Générer le HTML de la facture
    const invoiceHtml = generateInvoiceHtml(invoiceData);

    // Sauvegarder les données de la facture dans la base de données
    const db = readDb();
    
    if (!Array.isArray(db.invoices)) {
      db.invoices = [];
    }

    // Ajouter la nouvelle facture
    const newInvoice = {
      id: invoiceNumber,
      appointmentId: appointment.id,
      clientId: appointment.clientId,
      clientName: appointment.clientName,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      amount: service.price,
      date: new Date().toISOString(),
      status: 'paid',
      color: appointment.color,
      pointsEarned: appointment.pointsEarned,
      pointsUsed: appointment.pointsUsed,
      discount: appointment.discount
    };

    // Ajouter au tableau des factures au lieu d'écraser
    db.invoices.push(newInvoice);

    // Sauvegarder dans la base de données
    if (!writeDb(db)) {
      throw new Error('Erreur lors de la sauvegarde de la facture');
    }

    console.log('Facture générée avec succès:', {
      invoiceNumber,
      clientName: client.name,
      amount: service.price
    });

    return {
      invoiceNumber,
      html: invoiceHtml
    };
  } catch (error) {
    console.error('Erreur détaillée lors de la génération de la facture:', error);
    throw error;
  }
};