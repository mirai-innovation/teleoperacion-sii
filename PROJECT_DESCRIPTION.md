# Descripción del Proyecto - Sistema de Teleoperación de Robots

## Visión General

Sistema web de gestión y teleoperación de robots en un entorno de laboratorio. Permite a los usuarios registrarse, gestionar reservas de tiempo para robots específicos, y acceder a controles remotos de diferentes tipos de robots según sus permisos asignados.

---

## Pipeline de Usuario

### 1. **Flujo de Autenticación**

#### Registro
- El usuario accede a la página de registro con un fondo degradado cálido (amarillo dorado a azul oscuro)
- Completa un formulario con información personal:
  - Email (usado como nombre de usuario)
  - Nombre y apellido
  - Ocupación
  - Empresa
  - País
  - Rol profesional
  - Contraseña
- Tras el registro exitoso, es redirigido al login

#### Login
- Página de login con fondo degradado azul-púrpura
- Muestra el logo del sistema
- Formulario simple con email y contraseña
- Enlace para registrarse si no tiene cuenta

### 2. **Experiencia Post-Login**

#### Dashboard Principal
- **Saludo personalizado**: "Hi [Nombre], what would you like to do today?"
- **Próxima sesión**: Muestra la fecha y hora de la próxima reserva programada
- **Vista dividida en dos columnas**:
  - **Columna izquierda (8/12)**:
    - Tres gráficas de líneas mostrando el historial de sesiones por robot (Arm, Pepper, Dog)
    - Tres tarjetas de acceso a robots con imágenes:
      - Si tiene acceso: botón azul "Access"
      - Si no tiene acceso: botón amarillo "Request a Trial"
  - **Columna derecha (4/12)**:
    - Gráfica circular (doughnut) mostrando el uso total por robot
    - Resumen de sesiones totales por robot

### 3. **Sistema de Reservas**

#### Vista de Reservas
- Título grande centrado: "Reservations"
- Formulario para crear nueva reserva:
  - Selección de robot (Arm Robot, Pepper Robot, Dog Robot)
  - Selección de fecha
  - Selección de hora
  - Duración (30 minutos, 1 hora, 2 horas)
- Botón para verificar disponibilidad de un robot en una fecha específica
- Dos secciones de listas:
  - **Próximas reservas**: Reservas futuras del usuario
  - **Reservas pasadas**: Historial de reservas completadas
- Cada reserva muestra: robot, fecha, hora, duración y opción para eliminar

### 4. **Control de Robots**

#### Acceso a Robots
- Los robots se cargan en un iframe dentro del panel principal
- Solo se muestran los robots a los que el usuario tiene acceso
- Tres tipos de robots disponibles:
  - **Arm Robot**: Robot brazo mecánico
  - **Pepper Robot Avatar**: Robot humanoide Pepper
  - **Dog Robot**: Robot cuadrúpedo

### 5. **Panel de Administración** (Solo para admins)

#### Gestión de Usuarios
- Lista de todos los usuarios registrados
- Para cada usuario, el admin puede:
  - Habilitar/deshabilitar acceso a robots específicos
  - Eliminar usuarios
  - Ver información del usuario

---

## Sistema de Conexión de Robots

### Arquitectura de Conexión

El sistema utiliza **conexiones remotas mediante IPs públicas** para acceder a los robots. Cada robot está alojado en un servidor independiente con su propia dirección IP y puerto específico.

### Configuración de Robots

Todos los robots comparten la misma **IP base**: `14.10.2.192`, pero cada uno opera en un **puerto diferente**:

#### 1. **Arm Robot (Brazo Robótico)**
- **IP completa**: `http://14.10.2.192:8069`
- **Ruta de acceso**: `/arm%20controll` (espacio codificado como %20)
- **URL completa**: `http://14.10.2.192:8069/arm%20controll`
- **Puerto**: `8069`
- **Descripción**: Control del brazo robótico mecánico

#### 2. **Pepper Robot Avatar**
- **IP completa**: `http://14.10.2.192:8070`
- **Ruta base**: `/` (raíz)
- **URL completa**: `http://14.10.2.192:8070`
- **Puerto**: `8070`
- **Endpoints disponibles**:
  - `/video_feed` - Stream de video en vivo
  - `/perform_action` - Ejecutar acciones predefinidas (greet, presentation, home)
  - `/say` - Texto a voz (TTS)
  - `/move_joint` - Control de articulaciones individuales
  - `/audio_feed` - Stream de audio
  - `/stop_audio` - Detener audio
- **Descripción**: Robot humanoide Pepper con capacidades de video, audio y movimiento

#### 3. **Dog Robot (Robot Cuadrúpedo)**
- **IP completa**: `http://14.10.2.192:8066`
- **Ruta base**: `/` (raíz)
- **URL completa**: `http://14.10.2.192:8066`
- **Puerto**: `8066`
- **Descripción**: Robot cuadrúpedo tipo perro

### Método de Conexión

#### Integración en el Sistema
- Los robots se cargan mediante **iframes** dentro del panel principal
- Cuando un usuario hace clic en "Access" a un robot, el sistema:
  1. Verifica que el usuario tenga permisos (`allowed_robots`)
  2. Carga la URL completa del robot en el iframe principal
  3. El iframe se muestra en el área de contenido (reemplazando el dashboard)

#### Ubicación de las URLs
Las URLs de los robots están hardcodeadas en múltiples lugares del sistema:
- **Sidebar** (layout.html): Enlaces de navegación
- **Dashboard**: Botones "Access" en las tarjetas de robots
- **Navegación móvil**: Menú colapsable para dispositivos móviles
- **Mapeo de URLs**: Diccionario JavaScript que mapea URLs a IDs de enlaces para activación visual

#### Flujo de Conexión

```
Usuario → Click "Access" → Verificación de permisos → Carga iframe con URL del robot
                                                              ↓
                                    http://14.10.2.192:[PUERTO]/[RUTA]
                                                              ↓
                                    Servidor del Robot responde con interfaz de control
```

### Consideraciones Técnicas

#### Seguridad y Acceso
- **Control de acceso**: Solo usuarios con el robot en su lista `allowed_robots` pueden ver y acceder a los enlaces
- **Verificación del lado del servidor**: Los permisos se validan antes de mostrar los enlaces
- **Verificación del lado del cliente**: JavaScript oculta/muestra enlaces según permisos actualizados

#### Comunicación
- **Protocolo**: HTTP (no HTTPS especificado)
- **Método**: GET para cargar la interfaz, POST para acciones (en el caso de Pepper)
- **CORS**: Los robots deben permitir conexiones desde el dominio del sistema principal

#### Dependencias de Red
- **Requiere**: Que los servidores de robots estén accesibles en la red
- **IP estática**: La IP `14.10.2.192` debe ser accesible desde el navegador del usuario
- **Puertos abiertos**: Los puertos 8066, 8069, 8070 deben estar abiertos y accesibles

### Funcionalidades por Robot

#### Pepper Robot (Más Complejo)
El robot Pepper tiene la interfaz más completa con:
- **Video streaming**: Feed de video en tiempo real
- **Control de acciones**: Botones para acciones predefinidas
- **Texto a voz**: Input de texto que el robot pronuncia
- **Control de articulaciones**: Movimiento de joints individuales
- **Audio streaming**: Reproducción de audio desde el robot

#### Arm Robot y Dog Robot
- Interfaz cargada directamente desde sus respectivos servidores
- Control específico según la implementación de cada servidor

### Notas para Implementación Futura

Para que una IA entienda y pueda modificar este sistema:
1. **IPs hardcodeadas**: Las IPs están directamente en el código HTML/JavaScript
2. **Configuración centralizada**: Sería recomendable mover las URLs a un archivo de configuración
3. **Manejo de errores**: No hay manejo explícito de errores de conexión (si el robot no está disponible)
4. **Timeouts**: No se especifican timeouts para las conexiones
5. **Fallbacks**: No hay páginas de error si un robot no responde

---

## Diseño Visual y Paleta de Colores

### Paleta Principal

#### Colores de Autenticación
- **Login**: 
  - Fondo: Degradado de `#4e54c8` a `#8f94fb` (azul-púrpura)
  - Botones: `#4e54c8` (hover: `#3b4099`)
  - Enlaces: `#4e54c8`

- **Registro**:
  - Fondo: Degradado de `#ffd89b` (amarillo dorado) a `#19547b` (azul oscuro)
  - Botones: `#19547b` (hover: `#153e5e`)
  - Enlaces: `#19547b`

#### Colores del Panel Principal
- **Sidebar**: 
  - Fondo: `#212529` (gris muy oscuro, casi negro)
  - Texto: Blanco
  - Enlaces activos/hover: `#007bff` (azul primario)

- **Contenido Principal**:
  - Fondo: `#f5f5f5` (gris muy claro)
  - Cards: Blanco con sombras suaves
  - Bordes redondeados: 10-15px

#### Colores de Robots
- **Arm Robot**: `#007bff` (azul primario)
- **Pepper Robot**: `#28a745` (verde)
- **Dog Robot**: `#ffc107` (amarillo/ámbar)

#### Colores de Estado
- **Botones primarios**: `#007bff` (azul)
- **Botones de advertencia**: `#ffc107` (amarillo) - para "Request Trial"
- **Texto secundario**: `#6c757d` (gris)
- **Títulos**: `#343a40` (gris oscuro)

### Tipografía
- **Fuente principal**: Arial, sans-serif
- **Títulos**: Negrita (bold)
- **Tamaños**:
  - Títulos principales: 1.5-3em
  - Subtítulos: 1.2em
  - Texto normal: Tamaño estándar

### Elementos Visuales

#### Cards (Tarjetas)
- Fondo blanco
- Bordes redondeados: 10-15px
- Sombra suave: `0 6px 12px rgba(0,0,0,0.1)`
- Sin bordes visibles
- Padding generoso: 20-30px

#### Botones
- Bordes redondeados
- Sin bordes visibles
- Efecto hover con cambio de color
- Ancho completo en formularios (`btn-block`)

#### Gráficas
- **Gráficas de línea**: Para historial de sesiones por robot
  - Arm Robot: Azul (`#007bff`)
  - Pepper Robot: Verde (`#28a745`)
  - Dog Robot: Amarillo (`#ffc107`)
- **Gráfica circular (doughnut)**: Para uso total
  - Colores correspondientes a cada robot
  - Centro vacío (cutout: 70%)

#### Imágenes de Robots
- Altura fija: 150-200px
- Object-fit: cover (mantiene proporción)
- Bordes superiores redondeados en las tarjetas

---

## Estructura de Navegación

### Layout Principal
- **Sidebar fijo** (250px de ancho) en escritorio:
  - Sección "Main": Dashboard, Reservations
  - Separador visual (hr)
  - Robots disponibles (solo los permitidos)
  - Sección "Administration" (solo para admins)
  - Footer con copyright y botón de logout

- **Contenido dinámico**:
  - Ocupa el resto del espacio
  - Carga contenido en un iframe
  - Permite navegación sin recargar la página completa

### Navegación Móvil
- **Navbar colapsable** en pantallas pequeñas
- Menú hamburguesa
- Misma estructura que el sidebar pero en formato dropdown

### Estados de Navegación
- **Enlace activo**: Fondo azul (`#007bff`) en el sidebar
- **Hover**: Mismo color azul
- **Transiciones**: Suaves entre secciones

---

## Flujo de Datos y Estados

### Estados del Usuario

#### Usuario Sin Acceso
- Ve las tarjetas de robots con botón "Request a Trial"
- No puede acceder a los controles de robots
- Puede hacer reservas (pero no usar los robots hasta obtener acceso)

#### Usuario Con Acceso
- Ve botones "Access" en las tarjetas de robots
- Puede acceder directamente a los controles
- Los robots aparecen en el sidebar

#### Administrador
- Acceso completo a todos los robots
- Sección adicional "Manage Users" en el sidebar
- Puede gestionar permisos de otros usuarios

### Gestión de Sesiones
- El sistema registra automáticamente el tiempo que el usuario pasa en cada sección
- Se envía al servidor cuando el usuario cambia de sección o cierra la página
- Los datos se usan para estadísticas en el dashboard

### Sistema de Reservas
- **Verificación de disponibilidad**: Antes de crear una reserva, se puede verificar qué horarios están ocupados
- **Prevención de solapamientos**: El sistema no permite reservas que se solapen en el tiempo para el mismo robot
- **Historial**: Se mantiene registro de todas las reservas pasadas y futuras

---

## Experiencia de Usuario (UX)

### Animaciones
- **Entrada de elementos**: Animaciones de fade-in desde diferentes direcciones
  - Arm Robot: `fadeInLeft`
  - Pepper Robot: `fadeInUp`
  - Dog Robot: `fadeInRight`
- **Transiciones suaves**: Entre secciones y estados

### Feedback Visual
- **Mensajes flash**: Aparecen en la parte superior para confirmar acciones
  - Éxito: Verde o azul
  - Error: Rojo
  - Información: Azul claro
- **Estados de botones**: Cambio de color en hover
- **Indicadores activos**: Enlaces resaltados en el sidebar

### Responsive Design
- **Escritorio**: Sidebar fijo + contenido principal
- **Tablet/Móvil**: 
  - Navbar colapsable
  - Tablas adaptativas (se convierten en cards en móvil)
  - Gráficas redimensionadas
  - Layout de una columna

### Accesibilidad
- Iconos descriptivos (Font Awesome)
- Contraste adecuado en todos los elementos
- Formularios con labels claros
- Navegación intuitiva

---

## Características Especiales

### Control de Acceso Dinámico
- Los robots aparecen/desaparecen del sidebar según los permisos
- Actualización en tiempo real cuando un admin cambia permisos
- Sistema de "trial requests" para usuarios sin acceso

### Dashboard Interactivo
- Gráficas interactivas (Chart.js)
- Visualización de datos históricos
- Resumen de uso por robot
- Próxima sesión destacada

### Sistema de Reservas Inteligente
- Verificación de disponibilidad en tiempo real
- Prevención automática de conflictos
- Visualización clara de horarios ocupados
- Gestión fácil de reservas (crear/eliminar)

---

## Flujo Completo de un Usuario Nuevo

1. **Registro** → Completa formulario con información personal
2. **Login** → Accede con sus credenciales
3. **Dashboard** → Ve robots disponibles pero sin acceso (botones "Request Trial")
4. **Solicita Trial** → Hace clic en "Request a Trial" para un robot
5. **Admin Aprueba** → El administrador habilita el acceso
6. **Acceso Otorgado** → El robot aparece en el sidebar y puede acceder
7. **Hace Reserva** → Programa tiempo para usar el robot
8. **Usa el Robot** → Accede al control remoto durante su reserva
9. **Ve Estadísticas** → Dashboard muestra su uso y sesiones

---

## Notas de Diseño

- **Consistencia**: Mismo estilo de cards, botones y colores en toda la aplicación
- **Jerarquía visual**: Títulos grandes, subtítulos medianos, texto normal
- **Espaciado generoso**: Padding y margins amplios para respiración visual
- **Sombras sutiles**: Profundidad sin ser excesivo
- **Gradientes**: Solo en páginas de autenticación para dar sensación premium
- **Iconografía**: Uso consistente de Font Awesome para mejor comprensión
