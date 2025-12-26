# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a desplegar el Sistema de Teleoperación de Robots en Vercel.

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub
3. Cluster de MongoDB (MongoDB Atlas recomendado)

## 🔧 Pasos para Deployment

### 1. Preparar el Repositorio

Asegúrate de que tu repositorio tenga:
- ✅ `vercel.json` configurado
- ✅ `.env.example` con las variables necesarias
- ✅ `.gitignore` incluyendo `.env`
- ✅ `package.json` con script `start`

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración de Node.js

### 3. Configurar Variables de Entorno

En el dashboard de Vercel, ve a **Settings → Environment Variables** y agrega:

```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/robot-teleoperation?retryWrites=true&w=majority
SESSION_SECRET=tu-clave-secreta-muy-segura-aqui-generar-una-nueva
NODE_ENV=production
```

**Importante**: 
- Genera un `SESSION_SECRET` nuevo y seguro para producción
- No uses el mismo `SESSION_SECRET` que en desarrollo
- Puedes generar uno con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Configurar MongoDB Atlas

Si usas MongoDB Atlas:

1. Ve a **Network Access** en tu cluster
2. Agrega la IP `0.0.0.0/0` (permite todas las IPs) o agrega las IPs de Vercel
3. Asegúrate de que el usuario de la base de datos tenga permisos adecuados

### 5. Deploy

1. Haz clic en **Deploy**
2. Vercel construirá y desplegará tu aplicación automáticamente
3. Una vez completado, recibirás una URL (ej: `tu-proyecto.vercel.app`)

### 6. Configurar Dominio Personalizado (Opcional)

1. Ve a **Settings → Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## 🔄 Deployment Automático

Vercel está configurado para:
- **Deploy automático** en cada push a `main` o `master`
- **Preview deployments** para cada pull request
- **Rollback** fácil desde el dashboard

## 🐛 Troubleshooting

### Error: "Cannot find module"

- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `node_modules` esté en `.gitignore`

### Error de conexión a MongoDB

- Verifica que `MONGO_URI` esté correctamente configurado
- Asegúrate de que MongoDB Atlas permita conexiones desde Vercel
- Revisa los logs en Vercel para más detalles

### Error: "Session secret not set"

- Verifica que `SESSION_SECRET` esté configurado en Environment Variables
- Asegúrate de que esté disponible para el entorno de producción

### Variables de entorno no funcionan

- Verifica que las variables estén en **Production** environment
- Reinicia el deployment después de agregar nuevas variables

## 📊 Monitoreo

Vercel proporciona:
- **Logs** en tiempo real
- **Analytics** de rendimiento
- **Function logs** para debugging

## 🔐 Seguridad en Producción

- ✅ Usa `SESSION_SECRET` fuerte y único
- ✅ Configura MongoDB con usuario con permisos limitados
- ✅ Usa HTTPS (automático en Vercel)
- ✅ Revisa los logs regularmente
- ✅ Mantén las dependencias actualizadas

## 📝 Notas Adicionales

- Los robots deben estar accesibles desde internet para funcionar en producción
- Considera usar un servicio de proxy si los robots están en una red privada
- Vercel tiene límites en el tiempo de ejecución de funciones (10 segundos en plan gratuito)

---

¿Problemas? Revisa los [docs de Vercel](https://vercel.com/docs) o los logs de deployment.

