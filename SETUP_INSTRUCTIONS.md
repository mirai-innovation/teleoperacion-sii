# 🚀 Instrucciones de Configuración

## Pasos para Iniciar el Proyecto

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGO_URI=mongodb://localhost:27017/teleoperation_robot
SESSION_SECRET=tu-clave-secreta-muy-segura-aqui
PORT=3000
NODE_ENV=development
```

**Importante**: 
- Cambia `SESSION_SECRET` por una cadena aleatoria segura
- Ajusta `MONGO_URI` según tu configuración de MongoDB

### 3. Iniciar MongoDB
Asegúrate de que MongoDB esté corriendo:

```bash
# En Windows (si está instalado como servicio)
# MongoDB debería iniciarse automáticamente

# En Linux/Mac
sudo systemctl start mongod
# o
mongod
```

### 4. Iniciar el Servidor

**Desarrollo (con auto-reload):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

### 5. Acceder a la Aplicación
Abre tu navegador en: `http://localhost:3000`

## 📝 Crear Usuario Administrador

Para crear el primer usuario administrador, puedes:

1. **Registrarte normalmente** y luego modificar la base de datos:
```javascript
// En MongoDB shell o Compass
db.users.updateOne(
  { email: "tu-email@ejemplo.com" },
  { $set: { role: "admin" } }
)
```

2. **O usar un script de inicialización** (crear archivo `scripts/createAdmin.js`):
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new User({
      name: 'Administrador',
      email: 'admin@robot.com',
      password: hashedPassword,
      role: 'admin',
      allowed_robots: ['arm', 'pepper', 'dog'],
      isActive: true,
    });
    
    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('Email: admin@robot.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Ejecutar con:
```bash
node scripts/createAdmin.js
```

## 🔧 Solución de Problemas

### Error: "Cannot find module"
- Asegúrate de haber ejecutado `npm install`
- Verifica que estés en el directorio correcto

### Error de conexión a MongoDB
- Verifica que MongoDB esté corriendo
- Revisa la URI en `.env`
- Asegúrate de que el puerto 27017 esté disponible

### Error: "Port already in use"
- Cambia el puerto en `.env` o
- Detén el proceso que está usando el puerto 3000

### Las vistas no se renderizan correctamente
- Verifica que la carpeta `views` exista
- Asegúrate de que EJS esté instalado: `npm install ejs`

## 📚 Estructura del Proyecto

```
teleoperation-robot/
├── config/          # Configuraciones (DB, robots)
├── models/          # Modelos de MongoDB
├── middleware/      # Middleware de autenticación
├── routes/          # Rutas de la aplicación
├── views/           # Plantillas EJS
├── public/           # Archivos estáticos (CSS, JS)
├── server.js         # Servidor principal
└── package.json      # Dependencias
```

## 🎨 Personalización

### Cambiar Colores Neón
Edita `public/css/main.css` y modifica las variables CSS en `:root`:

```css
:root {
  --neon-cyan: #29B6F6;      /* Arm Robot */
  --neon-green: #00E676;     /* Pepper Robot */
  --neon-orange: #FF9100;    /* Dog Robot */
}
```

### Cambiar IPs de Robots
Edita `config/robots.js` para modificar las URLs de los robots.

## ✅ Checklist de Verificación

- [ ] Node.js instalado (v18+)
- [ ] MongoDB instalado y corriendo
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] Servidor iniciado sin errores
- [ ] Puedes acceder a `http://localhost:3000`
- [ ] Puedes registrarte y hacer login
- [ ] Los robots están accesibles en la red

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs del servidor
2. Verifica la consola del navegador
3. Revisa la conexión a MongoDB
4. Asegúrate de que todas las dependencias estén instaladas

