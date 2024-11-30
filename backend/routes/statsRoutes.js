import express from 'express';
import { readDb } from '../db.js';
import moment from 'moment';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  try {
    const db = readDb();
    const now = moment();
    const lastMonth = moment().subtract(1, 'month');

    // Calculer les statistiques des factures
    const currentMonthInvoices = db.invoices.filter(inv => 
      moment(inv.date).isSame(now, 'month')
    );

    const lastMonthInvoices = db.invoices.filter(inv => 
      moment(inv.date).isSame(lastMonth, 'month')
    );

    const currentMonthRevenue = currentMonthInvoices.reduce((total, inv) => total + inv.amount, 0);
    const lastMonthRevenue = lastMonthInvoices.reduce((total, inv) => total + inv.amount, 0);

    // Calculer la croissance mensuelle
    const monthlyGrowth = lastMonthRevenue === 0 
      ? 100 
      : Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);

    // Calculer les revenus des 6 derniers mois
    const revenueData = Array.from({ length: 6 }, (_, i) => {
      const month = moment().subtract(5 - i, 'months');
      const monthInvoices = db.invoices.filter(inv => 
        moment(inv.date).isSame(month, 'month')
      );
      return monthInvoices.reduce((total, inv) => total + inv.amount, 0);
    });

    // Calculer les statistiques
    const stats = {
      activeClients: new Set(db.appointments.map(apt => apt.clientId)).size,
      todayAppointments: db.appointments.filter(apt => 
        moment(apt.date).isSame(now, 'day')
      ).length,
      monthlyRevenue: currentMonthRevenue,
      monthlyGrowth,
      revenueChart: {
        labels: Array.from({ length: 6 }, (_, i) => 
          moment().subtract(5 - i, 'months').format('MMMM')
        ),
        datasets: [{
          label: "Chiffre d'affaires 2024",
          data: revenueData,
          borderColor: 'rgb(236, 72, 153)',
          tension: 0.3
        }]
      },
      popularServices: db.services
        .map(service => {
          const serviceInvoices = db.invoices.filter(inv => 
            inv.serviceId === service.id && 
            moment(inv.date).isAfter(lastMonth)
          );
          return {
            name: service.name,
            reservations: serviceInvoices.length,
            revenue: serviceInvoices.reduce((total, inv) => total + inv.amount, 0),
            growth: Math.floor(Math.random() * 20) // Pour la démo
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
      upcomingAppointments: db.appointments
        .filter(apt => moment(apt.date).isAfter(now))
        .sort((a, b) => moment(a.date).diff(moment(b.date)))
        .slice(0, 5)
        .map(apt => ({
          client: apt.clientName,
          service: apt.serviceName,
          duration: `${apt.duration} min`,
          employee: apt.employeeName,
          date: moment(apt.date).format('dddd D MMMM YYYY'),
          time: apt.time,
          status: apt.status
        }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;