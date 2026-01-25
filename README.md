# 🌟 WebClasesOnlineAmerica - Plataforma Educativa Premium

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com)
[![Language](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Framework](https://img.shields.io/badge/Framework-React_19-61DAFB?logo=react)](https://reactjs.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-Prisma_SQLite-2D3748?logo=prisma)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> Una plataforma educativa moderna y elegante para estudiantes, profesores y administradores. Construida con las últimas tecnologías para una experiencia de aprendizaje excepcional.

---

## ✨ Características Destacadas

### 🎨 Diseño y UX
- **Interfaz Premium**: Glassmorphism con efectos visuales avanzados
- **Animaciones Fluidas**: Framer Motion para transiciones suaves
- **Responsive Design**: Optimizado para desktop, tablet y móvil
- **Temas Personalizables**: Modo estudiante, profesor y premium

### 🔐 Seguridad y Autenticación
- **JWT Authentication**: Sistema seguro de tokens
- **Roles y Permisos**: Estudiante, Profesor, Administrador
- **Validación Robusta**: Protección contra inyección y ataques comunes
- **CORS Configurado**: Seguridad en producción

### 📚 Funcionalidades Educativas
- **Gestión de Cursos**: Crear y administrar contenido educativo
- **Flashcards Interactivas**: Sistema de tarjetas de memoria
- **Dashboard Personalizado**: Vista adaptada por rol
- **Progreso del Estudiante**: Seguimiento de aprendizaje

### 🚀 Tecnologías Modernas
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Base de Datos**: SQLite con Prisma ORM
- **Despliegue**: Vercel con serverless functions

---

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** o **yarn**
- **Git** ([Descargar](https://git-scm.com/))

### 🚀 Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ExeDevCentral/WebClasesOnlineAmerica.git
   cd WebClasesOnlineAmerica
   ```

2. **Instalar dependencias**
   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   cd ..
   ```

3. **Configurar entorno**
   
   **Archivo `.env` (raíz del proyecto):**
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_GOOGLE_CLIENT_ID=tu_google_client_id
   ```

   **Archivo `server/.env`:**
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=tu_clave_jwt_super_segura_min_32_caracteres
   DATABASE_URL=file:./dev.db
   FRONTEND_URL=http://localhost:5173
   GOOGLE_CLIENT_ID=tu_google_client_id
   GOOGLE_CLIENT_SECRET=tu_google_client_secret
   ```

4. **Configurar base de datos**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   cd ..
   ```

5. **Iniciar desarrollo**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Acceder**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

---

## 🌐 Despliegue en Producción

### Vercel (Recomendado)

1. **Conectar GitHub a Vercel**
   - Importa el repositorio en [vercel.com](https://vercel.com)
   - Vercel detectará automáticamente la configuración

2. **Variables de Entorno en Vercel**
   ```
   VITE_API_URL=https://tu-dominio.vercel.app/api
   JWT_SECRET=clave_produccion_segura
   DATABASE_URL=url_postgresql_produccion
   FRONTEND_URL=https://tu-dominio.vercel.app
   NODE_ENV=production
   ```

3. **Despliegue Automático**
   - Cada push a `main` activa un despliegue
   - Preview deployments para pull requests

### Configuración de Base de Datos en Producción

Para producción, recomendamos:
- **Vercel Postgres**: Integración nativa con Vercel
- **PlanetScale**: MySQL serverless
- **Supabase**: PostgreSQL con API REST

Ejemplo con Vercel Postgres:
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

---

## 📁 Arquitectura del Proyecto

```
WebClasesOnlineAmerica/
├── 📁 api/                    # Serverless functions (Vercel)
│   └── index.js
├── 📁 server/                 # Backend Node.js
│   ├── 📁 src/
│   │   ├── index.js          # Servidor Express
│   │   ├── 📁 routes/        # Rutas API
│   │   ├── 📁 middleware/    # Middlewares
│   │   ├── 📁 utils/         # Utilidades
│   │   └── 📁 config/        # Configuración
│   ├── 📁 prisma/            # Schema y migraciones
│   └── package.json
├── 📁 src/                    # Frontend React
│   ├── 📁 components/        # Componentes reutilizables
│   ├── 📁 pages/            # Páginas de la aplicación
│   ├── 📁 services/         # Servicios API
│   ├── 📁 contexts/         # Contextos React
│   ├── 📁 types/            # Definiciones TypeScript
│   └── 📁 utils/            # Utilidades frontend
├── 📁 public/                # Assets estáticos
├── 📄 vercel.json            # Configuración Vercel
├── 📄 package.json           # Dependencias frontend
└── 📄 README.md
```

---

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run preview      # Preview build local
npm run lint         # Ejecutar linter
npm run test         # Ejecutar tests (si existen)
```

### Backend
```bash
cd server
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm test             # Ejecutar tests
npm run seed         # Poblar base de datos
```

### Base de Datos
```bash
cd server
npx prisma studio    # Interfaz gráfica DB
npx prisma generate  # Generar cliente Prisma
npx prisma migrate dev # Crear migración desarrollo
```

---

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test  # Ejecuta tests con Jest
```

### Credenciales de Prueba
- **Admin**: admin@edustream.com / admin123
- **Profesor**: prof.garcia@edustream.com / teacher123
- **Estudiante**: estudiante1@edustream.com / student123

---

## 📡 API Documentation

### Autenticación
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/google
```

### Cursos
```
GET    /api/classes
POST   /api/classes
GET    /api/classes/:id
PUT    /api/classes/:id
DELETE /api/classes/:id
```

### Flashcards
```
GET    /api/flashcards/decks
POST   /api/flashcards/decks
GET    /api/flashcards/decks/:id
PUT    /api/flashcards/decks/:id
DELETE /api/flashcards/decks/:id
GET    /api/flashcards/decks/:id/cards
POST   /api/flashcards/decks/:id/cards
```

### Health Check
```
GET /api/health
```

---

## 🔒 Seguridad

- **Hashing de Contraseñas**: bcrypt con salt rounds
- **JWT Tokens**: Expiración configurable
- **Input Validation**: express-validator en todas las rutas
- **Rate Limiting**: Protección contra abuso
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para orígenes específicos

---

## 🎨 Personalización

### Temas
La aplicación incluye 3 temas predefinidos:
- **Estudiante Azul**: Tema por defecto
- **Profesor Negro**: Tema premium con acentos dorados
- **Lila Premium**: Tema elegante con tonos púrpura

### Variables CSS
Personaliza colores en `src/index.css`:
```css
@theme {
  --color-primary-500: #tu-color;
  --bg-app: #tu-fondo;
}
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 

### Proceso
1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Código
- Usa TypeScript para type safety
- Sigue ESLint configuration
- Escribe tests para nuevas funcionalidades
- Actualiza documentación

---

## 📄 Licencia

Distribuido bajo la **Licencia MIT**. Ver `LICENSE` para más información.

---

## 👨‍💻 Autor

**ExeDevCentral**
- 🌐 Website: [tu-sitio-web]
- 📧 Email: tu-email@ejemplo.com
- 🐙 GitHub: [@ExeDevCentral](https://github.com/ExeDevCentral)
- 💼 LinkedIn: [tu-linkedin]

---

## 🙏 Agradecimientos

- **React Team** - Por el mejor framework frontend
- **Vercel** - Por la mejor plataforma de despliegue
- **Tailwind CSS** - Por el sistema de diseño utilitario
- **Prisma** - Por el mejor ORM para TypeScript
- **Framer Motion** - Por las animaciones fluidas

---

## 📞 Soporte

Si tienes preguntas o problemas:
- Abre un [Issue](https://github.com/ExeDevCentral/WebClasesOnlineAmerica/issues)
- Revisa la [Documentación](https://github.com/ExeDevCentral/WebClasesOnlineAmerica/wiki)
- Contacta al maintainer

---

*⭐ Si te gusta el proyecto, dale una estrella en GitHub!*"
