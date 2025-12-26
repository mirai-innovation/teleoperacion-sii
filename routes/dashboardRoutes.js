/**
 * Dashboard Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Session from '../models/Session.js';
import { getAllRobots } from '../config/robots.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

/**
 * GET /dashboard
 * Show main dashboard
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);

    // Get next reservation
    const nextReservation = await Reservation.findOne({
      user: userId,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'active'] },
    })
      .sort({ date: 1, startTime: 1 })
      .limit(1);

    // Get session statistics (last 30 days)
    const sessionStats = await Session.getUsageStats(userId, 30);

    // Formatear datos para gráficas
    const robots = getAllRobots();
    const chartData = robots.map((robot) => {
      const stat = sessionStats.find((s) => s._id === robot.id);
      return {
        robot: robot.name,
        sessions: stat ? stat.totalSessions : 0,
        minutes: stat ? stat.totalMinutes : 0,
        color: robot.color,
      };
    });

    // Get session history by robot (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const historyData = await Promise.all(
      robots.map(async (robot) => {
        const sessions = await Session.find({
          user: userId,
          robot: robot.id,
          createdAt: { $gte: sevenDaysAgo },
        })
          .sort({ createdAt: 1 })
          .limit(20);

        return {
          robot: robot.name,
          robotId: robot.id,
          color: robot.color,
          data: sessions.map((s) => ({
            date: s.createdAt,
            duration: s.duration,
          })),
        };
      })
    );

    res.render('dashboard/index', {
      title: 'Dashboard',
      user: req.session.user,
      nextReservation,
      chartData,
      historyData,
      robots: robots.filter((robot) => {
        // Show only robots the user has access to, or all if admin
        if (user.role === 'admin') return true;
        return user.allowed_robots.includes(robot.id);
      }),
    });
  } catch (error) {
    console.error('Error in dashboard:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading dashboard',
      user: req.session.user,
    });
  }
});

export default router;

