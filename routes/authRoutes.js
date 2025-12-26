/**
 * Rutas de Autenticación
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /auth/login
 * Show login page
 */
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  const registered = req.query.registered === '1';
  res.render('auth/login', {
    title: 'Login',
    error: null,
    registered: registered,
  });
});

/**
 * POST /auth/login
 * Process login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid credentials',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid credentials',
      });
    }

    // Verify active account
    if (!user.isActive) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Your account is inactive. Contact the administrator.',
      });
    }

    // Create session
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      allowed_robots: user.allowed_robots || [],
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error in login:', error);
    res.render('auth/login', {
      title: 'Login',
      error: 'Error signing in. Please try again.',
    });
  }
});

/**
 * GET /auth/register
 * Show registration page
 */
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/register', {
    title: 'Sign Up',
    error: null,
  });
});

/**
 * POST /auth/register
 * Process registration
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, occupation, company, country } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.render('auth/register', {
        title: 'Sign Up',
        error: 'Name, email and password are required',
      });
    }

    if (password.length < 6) {
      return res.render('auth/register', {
        title: 'Sign Up',
        error: 'Password must be at least 6 characters',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Sign Up',
        error: 'This email is already registered',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      occupation: occupation?.trim() || '',
      company: company?.trim() || '',
      country: country?.trim() || '',
      role: 'user',
      allowed_robots: [],
      isActive: true,
    });

    await user.save();

    // Redirigir a login
    res.redirect('/auth/login?registered=1');
  } catch (error) {
    console.error('Error in registration:', error);
    res.render('auth/register', {
      title: 'Sign Up',
      error: 'Error signing up. Please try again.',
    });
  }
});

/**
 * GET /auth/logout
 * Logout
 */
router.get('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.redirect('/auth/login');
  });
});

export { router as authRoutes };

