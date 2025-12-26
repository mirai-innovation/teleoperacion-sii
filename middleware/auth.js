/**
 * Middleware de Autenticación
 * Verifica que el usuario esté autenticado
 */

export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

/**
 * Middleware de Admin
 * Verifica que el usuario sea administrador
 */
export const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  if (req.session.user.role !== 'admin') {
    return res.status(403).render('error', {
      title: '403 - Acceso Denegado',
      message: 'No tienes permisos para acceder a esta sección',
      user: req.session.user,
    });
  }

  next();
};

/**
 * Middleware para verificar acceso a robot
 * Verifica que el usuario tenga permiso para acceder a un robot específico
 */
export const requireRobotAccess = (robotId) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const user = req.session.user;
    
    // Los admins tienen acceso a todos los robots
    if (user.role === 'admin') {
      return next();
    }

    // Verificar si el usuario tiene acceso al robot
    if (!user.allowed_robots || !user.allowed_robots.includes(robotId)) {
      return res.status(403).render('error', {
        title: '403 - Acceso Denegado',
        message: `No tienes acceso al robot ${robotId}`,
        user: req.session.user,
      });
    }

    next();
  };
};

