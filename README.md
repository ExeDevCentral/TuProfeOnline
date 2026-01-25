# 🎓 Tu Profe Online

**Plataforma de clases en vivo con Google Meet** - Conecta con tus estudiantes de forma profesional y segura.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📋 Descripción

**Tu Profe Online** es una plataforma web moderna diseñada para facilitar la gestión y realización de clases en vivo utilizando Google Meet. Permite a profesores y estudiantes conectarse de manera segura, programar clases, y gestionar sesiones educativas con una interfaz intuitiva y profesional.

### ✨ Características Principales

- 🔐 **Autenticación Segura**: Login con Google OAuth 2.0 y sistema de registro tradicional
- 📅 **Gestión de Clases**: Crea, programa y administra clases en vivo
- 🎥 **Integración con Google Meet**: Genera y accede a enlaces de videollamadas automáticamente
- 👥 **Roles de Usuario**: Sistema diferenciado para profesores y estudiantes
- 📊 **Dashboard Intuitivo**: Panel de control con vista de clases programadas y próximas
- 🎨 **Diseño Moderno**: Interfaz responsive con animaciones fluidas
- 🔔 **Notificaciones**: Sistema de alertas para clases próximas
- 🌐 **Multiidioma**: Soporte para español (expandible a otros idiomas)

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS 4** - Framework de estilos
- **Framer Motion** - Animaciones
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Google OAuth** - Autenticación

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5** - Framework web
- **Prisma** - ORM para base de datos
- **PostgreSQL/SQLite** - Base de datos
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **Google Auth Library** - Verificación de tokens de Google
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso
- **Express Rate Limit** - Limitación de peticiones
- **Winston** - Logging

### DevOps & Tools
- **ESLint** - Linter de código
- **Jest** - Testing
- **Cypress** - Testing E2E
- **Vercel** - Deployment (frontend)
- **GitHub Actions** - CI/CD

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Git
- Cuenta de Google Cloud Platform (para OAuth)
- PostgreSQL (opcional, puede usar SQLite para desarrollo)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ExeDevCentral/TuProfeOnline.git
cd TuProfeOnline
```

### 2. Instalar Dependencias

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd server
npm install
cd ..
```

### 3. Configurar Variables de Entorno

#### Frontend - `.env`
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id_aqui
```

#### Backend - `server/.env`
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### 4. Configurar Base de Datos

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

### 5. Iniciar el Proyecto

#### Opción A: Iniciar Frontend y Backend por separado

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Opción B: Script personalizado (si existe)
```bash
npm start
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 🔑 Configuración de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ y Google Calendar
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth 2.0"
5. Configura la pantalla de consentimiento
6. Agrega los orígenes autorizados:
   - `http://localhost:5173` (desarrollo)
   - Tu dominio de producción
7. Agrega los URIs de redirección autorizados:
   - `http://localhost:5173` (desarrollo)
   - Tu dominio de producción
8. Copia el Client ID y Client Secret a tus archivos `.env`

---

## 📖 Uso

### Para Profesores

1. **Registro/Login**: Crea una cuenta o inicia sesión con Google
2. **Crear Clase**: Desde el dashboard, haz clic en "Nueva Clase"
3. **Programar Sesión**: Define título, descripción, fecha y hora
4. **Compartir Enlace**: El sistema genera automáticamente un enlace de Google Meet
5. **Gestionar Estudiantes**: Visualiza quiénes se han unido a tus clases

### Para Estudiantes

1. **Registro/Login**: Crea una cuenta o inicia sesión con Google
2. **Explorar Clases**: Navega por las clases disponibles
3. **Unirse a Clase**: Inscríbete en las clases de tu interés
4. **Acceder a Sesiones**: Únete a las videollamadas desde el dashboard

---

## 🗂️ Estructura del Proyecto

```
TuProfeOnline/
├── src/                          # Frontend source
│   ├── components/               # Componentes React
│   │   ├── LoginModal.tsx
│   │   ├── RegisterModal.tsx
│   │   └── VideoBackground.tsx
│   ├── contexts/                 # Contextos de React
│   │   └── AuthContext.tsx
│   ├── pages/                    # Páginas principales
│   │   ├── LandingPage.tsx
│   │   └── Dashboard.tsx
│   ├── services/                 # Servicios API
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── classService.ts
│   ├── utils/                    # Utilidades
│   │   └── googleApi.ts
│   ├── App.tsx                   # Componente principal
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globales
├── server/                       # Backend source
│   ├── prisma/                   # Esquema y migraciones
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/               # Configuración
│   │   │   └── database.js
│   │   ├── middleware/           # Middlewares
│   │   │   └── auth.js
│   │   ├── routes/               # Rutas API
│   │   │   ├── auth.js
│   │   │   └── classes.js
│   │   ├── index.js              # Server entry point
│   │   └── seed.js               # Database seeding
│   └── package.json
├── public/                       # Assets estáticos
├── docs/                         # Documentación adicional
├── package.json                  # Dependencias frontend
├── vite.config.ts                # Configuración Vite
├── tsconfig.json                 # Configuración TypeScript
└── README.md                     # Este archivo
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/google` | Autenticación con Google |
| GET | `/api/auth/me` | Obtener usuario actual |

### Clases

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/classes` | Listar todas las clases |
| POST | `/api/classes` | Crear nueva clase |
| GET | `/api/classes/:id` | Obtener clase específica |
| PUT | `/api/classes/:id` | Actualizar clase |
| DELETE | `/api/classes/:id` | Eliminar clase |
| POST | `/api/classes/:id/join` | Unirse a una clase |

---

## 🚀 Deployment

### Frontend (Vercel)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push a `main`

### Backend (Railway/Render/Heroku)

1. Configura las variables de entorno en tu plataforma
2. Asegúrate de configurar PostgreSQL en producción
3. Ejecuta las migraciones de Prisma

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# E2E tests (interactive)
npm run test:e2e:open
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **ExeDevCentral** - [GitHub](https://github.com/ExeDevCentral)

---

## 🙏 Agradecimientos

- Google por las APIs de OAuth y Meet
- La comunidad de React y Node.js
- Todos los contribuidores del proyecto

---

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: [Agregar email de soporte]
- 🐛 Issues: [GitHub Issues](https://github.com/ExeDevCentral/TuProfeOnline/issues)
- 📖 Documentación: [Wiki del proyecto](https://github.com/ExeDevCentral/TuProfeOnline/wiki)

---

**¡Hecho con ❤️ para la educación online!**
