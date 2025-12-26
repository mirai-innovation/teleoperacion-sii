/**
 * Configuración Centralizada de Robots
 * IP Base: 14.10.2.192
 * Cada robot opera en un puerto diferente
 */

export const ROBOTS_CONFIG = {
  arm: {
    id: 'arm',
    name: 'Arm Robot',
    displayName: 'Arm Robot',
    ip: '14.10.2.192',
    port: 8069,
    path: '/arm%20controll', // Espacio codificado como %20
    fullUrl: 'http://14.10.2.192:8069/arm%20controll',
    color: '#29B6F6', // Cian neón
    description: 'Control del brazo robótico mecánico',
    icon: '🤖',
    image: '/images/robots/arm-robot.png', // Ruta para imagen 3D o icono
    image3d: '/images/robots/arm-robot-3d.glb' // Opcional: modelo 3D GLB/GLTF
  },
  pepper: {
    id: 'pepper',
    name: 'Pepper Robot',
    displayName: 'Pepper Robot Avatar',
    ip: '14.10.2.192',
    port: 8070,
    path: '/',
    fullUrl: 'http://14.10.2.192:8070',
    color: '#00E676', // Verde neón
    description: 'Robot humanoide Pepper con capacidades de video, audio y movimiento',
    icon: '👤',
    image: '/images/robots/pepper1.png', // Ruta para imagen 3D o icono
    image3d: '/images/robots/pepper-robot-3d.glb', // Opcional: modelo 3D GLB/GLTF
    endpoints: {
      videoFeed: '/video_feed',
      performAction: '/perform_action',
      say: '/say',
      moveJoint: '/move_joint',
      audioFeed: '/audio_feed',
      stopAudio: '/stop_audio'
    }
  },
  dog: {
    id: 'dog',
    name: 'Dog Robot',
    displayName: 'Dog Robot',
    ip: '14.10.2.192',
    port: 8066,
    path: '/',
    fullUrl: 'http://14.10.2.192:8066',
    color: '#FF9100', // Naranja neón
    description: 'Robot cuadrúpedo tipo perro',
    icon: '🐕',
    image: '/images/robots/unitreego2.png', // Ruta para imagen 3D o icono
    image3d: '/images/robots/dog-robot-3d.glb' // Opcional: modelo 3D GLB/GLTF
  }
};

/**
 * Obtener configuración de un robot por ID
 */
export const getRobotConfig = (robotId) => {
  return ROBOTS_CONFIG[robotId] || null;
};

/**
 * Obtener todos los robots disponibles
 */
export const getAllRobots = () => {
  return Object.values(ROBOTS_CONFIG);
};

/**
 * Verificar si un robot existe
 */
export const robotExists = (robotId) => {
  return robotId in ROBOTS_CONFIG;
};

/**
 * Obtener URL completa de un robot
 */
export const getRobotUrl = (robotId) => {
  const config = getRobotConfig(robotId);
  return config ? config.fullUrl : null;
};

