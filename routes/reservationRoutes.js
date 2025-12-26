/**
 * Reservation Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Reservation from '../models/Reservation.js';
import { getAllRobots } from '../config/robots.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

/**
 * GET /reservations
 * Show reservations page
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const robots = getAllRobots();

    // Get upcoming reservations
    const upcomingReservations = await Reservation.find({
      user: userId,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'active'] },
    })
      .sort({ date: 1, startTime: 1 })
      .lean();

    // Get past reservations
    const pastReservations = await Reservation.find({
      user: userId,
      $or: [
        { date: { $lt: new Date() } },
        { status: { $in: ['completed', 'cancelled'] } },
      ],
    })
      .sort({ date: -1, startTime: -1 })
      .limit(20)
      .lean();

    res.render('reservations/index', {
      title: 'Reservations',
      user: req.session.user,
      robots,
      upcomingReservations,
      pastReservations,
    });
  } catch (error) {
    console.error('Error in reservations:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading reservations',
      user: req.session.user,
    });
  }
});

/**
 * POST /reservations
 * Create new reservation
 */
router.post('/', async (req, res) => {
  try {
    const { robot, date, startTime, duration } = req.body;
    const userId = req.session.user.id;

    // Validaciones
    if (!robot || !date || !startTime || !duration) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check conflict
    const conflict = await Reservation.checkConflict(
      robot,
      date,
      startTime,
      parseInt(duration)
    );

    if (conflict) {
      return res.status(400).json({
        error: 'A reservation already exists at that time for this robot',
      });
    }

    // Create reservation
    const reservation = new Reservation({
      user: userId,
      robot,
      date: new Date(date),
      startTime,
      duration: parseInt(duration),
      status: 'pending',
    });

    await reservation.save();

    res.json({ success: true, reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

/**
 * GET /reservations/check-availability
 * Check robot availability on a date
 */
router.get('/check-availability', async (req, res) => {
  try {
    const { robot, date } = req.query;

    if (!robot || !date) {
      return res.status(400).json({ error: 'Robot and date are required' });
    }

    const reservations = await Reservation.find({
      robot,
      date: new Date(date),
      status: { $in: ['pending', 'active'] },
    }).sort({ startTime: 1 });

    res.json({ reservations });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Error checking availability' });
  }
});

/**
 * DELETE /reservations/:id
 * Delete reservation
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const reservationId = req.params.id;

    const reservation = await Reservation.findOne({
      _id: reservationId,
      user: userId,
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    await reservation.deleteOne();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Error deleting reservation' });
  }
});

export default router;

