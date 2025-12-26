/**
 * Robot Routes
 */

import express from 'express';
import { requireAuth, requireRobotAccess } from '../middleware/auth.js';
import { getRobotConfig, robotExists } from '../config/robots.js';
import Session from '../models/Session.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

/**
 * GET /robots/:robotId
 * Show robot control interface
 */
router.get('/:robotId', requireRobotAccess, async (req, res) => {
  try {
    const { robotId } = req.params;

    if (!robotExists(robotId)) {
      return res.status(404).render('error', {
        title: '404 - Robot Not Found',
        message: 'The specified robot does not exist',
        user: req.session.user,
      });
    }

    const robotConfig = getRobotConfig(robotId);

    // Register session start
    const session = new Session({
      user: req.session.user.id,
      robot: robotId,
      startTime: new Date(),
    });
    await session.save();

    // Save session ID to close it later
    req.session.currentRobotSession = session._id.toString();

    res.render('robots/control', {
      title: `${robotConfig.displayName} - Control`,
      user: req.session.user,
      robot: robotConfig,
    });
  } catch (error) {
    console.error('Error loading robot:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error loading robot',
      user: req.session.user,
    });
  }
});

/**
 * POST /robots/:robotId/end-session
 * End robot usage session
 */
router.post('/:robotId/end-session', requireRobotAccess, async (req, res) => {
  try {
    const sessionId = req.session.currentRobotSession;

    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (session) {
        session.endTime = new Date();
        const durationMs = session.endTime - session.startTime;
        session.duration = Math.round(durationMs / 60000); // Convert to minutes
        await session.save();
      }
      delete req.session.currentRobotSession;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Error ending session' });
  }
});

export default router;

