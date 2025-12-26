# 🤖 Sistema de Teleoperación de Robots

Sistema web moderno para gestión y teleoperación de robots en un entorno de laboratorio. Construido con Node.js, Express, EJS y MongoDB.

## 🚀 Características

- **Autenticación de Usuarios**: Sistema de registro y login con sesiones seguras
- **Dashboard Interactivo**: Visualización de estadísticas y gráficas de uso
- **Sistema de Reservas**: Gestión de reservas de tiempo para robots específicos
- **Control de Robots**: Acceso remoto a robots mediante iframes
- **Panel de Administración**: Gestión de usuarios y permisos
- **Diseño Dark Modern Tech**: Interfaz futurista con efectos neón

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MongoDB (local o remoto)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio** (o descargar los archivos)

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
MONGO_URI=mongodb://localhost:27017/teleoperation_robot
SESSION_SECRET=tu-clave-secreta-aqui
PORT=3000
NODE_ENV=development
```

4. **Iniciar el servidor**:
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

5. **Acceder a la aplicación**:
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
teleoperation-robot/
├── config/
│   ├── db.js              # Configuración de MongoDB
│   └── robots.js          # Configuración centralizada de robots
├── models/
│   ├── User.js            # Modelo de Usuario
│   ├── Reservation.js     # Modelo de Reserva
│   └── Session.js         # Modelo de Sesión
├── middleware/
│   └── auth.js            # Middleware de autenticación
├── routes/
│   ├── authRoutes.js       # Rutas de autenticación
│   ├── dashboardRoutes.js  # Rutas del dashboard
│   ├── reservationRoutes.js # Rutas de reservas
│   ├── robotRoutes.js      # Rutas de robots
│   └── adminRoutes.js      # Rutas de administración
├── views/
│   ├── layout.ejs         # Layout principal
│   ├── auth/               # Vistas de autenticación
│   ├── dashboard/          # Vistas del dashboard
│   ├── reservations/       # Vistas de reservas
│   ├── robots/             # Vistas de robots
│   └── admin/              # Vistas de administración
├── public/
│   ├── css/
│   │   └── main.css        # Estilos principales
│   └── js/
│       └── main.js         # JavaScript principal
├── server.js               # Servidor Express principal
└── package.json
```

## 🎨 Paleta de Colores (Dark Modern Tech)

- **Fondos**: 
  - Principal: `#121212`
  - Paneles/Cards: `#1E1E1E`
  
- **Acentos Neón**:
  - Arm Robot: Cian `#29B6F6`
  - Pepper Robot: Verde `#00E676`
  - Dog Robot: Naranja `#FF9100`

- **Tipografía**:
  - Inter (interfaz)
  - JetBrains Mono (datos técnicos)

## 🤖 Configuración de Robots

Los robots están configurados en `config/robots.js`:

- **Arm Robot**: `http://14.10.2.192:8069/arm%20controll`
- **Pepper Robot**: `http://14.10.2.192:8070`
- **Dog Robot**: `http://14.10.2.192:8066`

## 🔐 Sistema de Permisos

- **Usuarios**: Solo pueden acceder a robots asignados en `allowed_robots`
- **Administradores**: Acceso completo a todos los robots y panel de gestión

## 📝 Funcionalidades Principales

### Dashboard
- Saludo personalizado
- Próxima sesión programada
- Gráficas de historial de sesiones
- Tarjetas de acceso a robots
- Resumen de uso por robot

### Reservas
- Crear nuevas reservas
- Verificar disponibilidad
- Gestionar reservas futuras y pasadas
- Eliminar reservas

### Control de Robots
- Acceso mediante iframes
- Registro automático de sesiones
- Validación de permisos

### Administración
- Gestión de usuarios
- Habilitar/deshabilitar acceso a robots
- Activar/desactivar usuarios
- Eliminar usuarios

## 🛡️ Seguridad

- Sesiones almacenadas en MongoDB
- Validación de permisos en servidor
- Middleware de autenticación
- Protección contra acceso no autorizado

## 📦 Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **express-session**: Gestión de sesiones
- **bcryptjs**: Hash de contraseñas
- **ejs**: Motor de plantillas
- **connect-mongo**: Almacenamiento de sesiones en MongoDB

## 🚧 Próximas Mejoras

- [ ] Notificaciones en tiempo real
- [ ] Sistema de logs de actividad
- [ ] Exportación de reportes
- [ ] API REST completa
- [ ] Tests automatizados

## 🚀 Deployment en Vercel

Este proyecto está configurado para deployment automático en Vercel.

### Pasos para Deployment:

1. **Conectar el repositorio a Vercel**:
   - Ve a [Vercel](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

2. **Configurar Variables de Entorno en Vercel**:
   - Ve a Settings → Environment Variables
   - Agrega las siguientes variables:
     ```
     MONGO_URI=tu-uri-de-mongodb
     SESSION_SECRET=tu-clave-secreta-segura
     PORT=3000 (opcional, Vercel lo maneja automáticamente)
     NODE_ENV=production
     ```

3. **Deployment Automático**:
   - Cada push a `main` o `master` desplegará automáticamente
   - Los pull requests crearán preview deployments

### Configuración de Vercel

El proyecto incluye `vercel.json` con la configuración necesaria:
- Usa `@vercel/node` para ejecutar el servidor Express
- Todas las rutas se dirigen a `server.js`
- Variables de entorno se configuran desde el dashboard de Vercel

### Notas Importantes:

- ⚠️ **MongoDB**: Asegúrate de que tu cluster de MongoDB permita conexiones desde las IPs de Vercel (o configura IP 0.0.0.0/0 para desarrollo)
- ⚠️ **Session Secret**: Usa una clave secreta fuerte y única en producción
- ⚠️ **Robots**: Los robots deben estar accesibles desde internet para que funcionen en producción

## 📄 Licencia

ISC

## 👤 Autor

Sistema de Teleoperación de Robots

---

**Nota**: Asegúrate de que los servidores de robots estén accesibles en la red antes de usar el sistema.

