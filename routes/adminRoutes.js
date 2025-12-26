/**
 * Rutas de Administración
 */

import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import { getAllRobots } from '../config/robots.js';

const router = express.Router();

// Todas las rutas requieren autenticación y permisos de admin
router.use(requireAuth);
router.use(requireAdmin);

/**
 * GET /admin/users
 * Show user management
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    const robots = getAllRobots();

    res.render('admin/users', {
      title: 'User Management',
      user: req.session.user,
      users,
      robots,
    });
  } catch (error) {
    console.error('Error in user management:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading user management',
      user: req.session.user,
    });
  }
});

/**
 * POST /admin/users/:userId/toggle-robot
 * Enable/disable robot access
 */
router.post('/users/:userId/toggle-robot', async (req, res) => {
  try {
    const { userId } = req.params;
    const { robotId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle robot access
    const index = user.allowed_robots.indexOf(robotId);
    if (index > -1) {
      user.allowed_robots.splice(index, 1);
    } else {
      user.allowed_robots.push(robotId);
    }

    await user.save();

    // Update session if it's the same user
    if (req.session.user.id === userId) {
      req.session.user.allowed_robots = user.allowed_robots;
    }

    res.json({ success: true, allowed_robots: user.allowed_robots });
  } catch (error) {
    console.error('Error changing access:', error);
    res.status(500).json({ error: 'Error changing access' });
  }
});

/**
 * POST /admin/users/:userId/toggle-active
 * Activate/deactivate user
 */
router.post('/users/:userId/toggle-active', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, isActive: user.isActive });
  } catch (error) {
    console.error('Error changing status:', error);
    res.status(500).json({ error: 'Error changing status' });
  }
});

/**
 * DELETE /admin/users/:userId
 * Delete user
 */
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // No permitir auto-eliminación
    if (req.session.user.id === userId) {
      return res.status(400).json({ error: 'You cannot delete yourself' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;

