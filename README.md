# WebClasesOnlineAmerica - Plataforma Educativa

[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com)
[![Language](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🚀 Características

- **Frontend Moderno**: React 19 + TypeScript + Vite
- **Backend API**: Express.js con Node.js
- **Diseño Premium**: Glassmorphism con animaciones Framer Motion
- **Base de Datos**: SQLite con Prisma (fácil migración a PostgreSQL)
- **Autenticación**: Sistema propio con JWT
- **Roles**: Estudiante, Profesor, Administrador
- **Despliegue**: Configurado para Vercel

---

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+ y npm
- Git

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ExeDevCentral/WebClasesOnlineAmerica.git
   cd WebClasesOnlineAmerica
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**
   
   Crear `.env` en la raíz:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```
   
   Crear `server/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=tu-clave-secreta-super-segura
   DATABASE_URL=file:./dev.db
   FRONTEND_URL=http://localhost:5173
   ```

5. **Iniciar servidores**

   Terminal 1 - Backend:
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 - Frontend:
   ```bash
   npm run dev
   ```

---

## 🌐 Despliegue en Vercel

### Opción 1: Despliegue Automático desde GitHub

1. **Conectar repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio `WebClasesOnlineAmerica`
   - Vercel detectará automáticamente la configuración

2. **Configurar Variables de Entorno en Vercel**
   
   En el dashboard de Vercel, agrega estas variables:
   ```
   VITE_API_URL=https://tu-app.vercel.app/api
   JWT_SECRET=tu-clave-secreta-de-produccion
   DATABASE_URL=tu-url-de-base-de-datos
   FRONTEND_URL=https://tu-app.vercel.app
   NODE_ENV=production
   ```

3. **Desplegar**
   - Vercel desplegará automáticamente en cada push a `main`
   - El frontend se servirá desde la raíz
   - El backend estará disponible en `/api/*`

### Opción 2: Despliegue Manual con Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Desplegar**
   ```bash
   vercel
   ```

4. **Configurar variables de entorno**
   ```bash
   vercel env add VITE_API_URL
   vercel env add JWT_SECRET
   vercel env add DATABASE_URL
   ```

---

## 📁 Estructura del Proyecto

```
WebClasesOnlineAmerica/
├── api/                 # Serverless functions para Vercel
│   └── index.js
├── server/              # Backend Express
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   └── middleware/
│   ├── prisma/
│   └── package.json
├── src/                 # Frontend React
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
├── public/              # Assets estáticos
├── vercel.json          # Configuración Vercel
├── .env.example         # Ejemplo variables frontend
└── package.json         # Frontend dependencies
```

---

## 🔧 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter

### Backend
- `cd server && npm run dev` - Servidor con nodemon
- `cd server && npm start` - Servidor producción

---

## 🗄️ Base de Datos

El proyecto usa Prisma ORM. Para configurar:

```bash
cd server
npx prisma generate
npx prisma migrate dev
```

Para ver la base de datos:
```bash
npx prisma studio
```

---

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt
- Tokens JWT con expiración
- Validación de entrada en todas las rutas
- CORS configurado para producción

---

## 📝 Notas de Despliegue

### Vercel
- El archivo `vercel.json` está configurado para servir:
  - Frontend desde la raíz (`/`)
  - API desde `/api/*`
- Las serverless functions están en `api/index.js`
- El build del frontend se genera en `dist/`

### Base de Datos en Producción
- Para producción, cambia `DATABASE_URL` a PostgreSQL o MySQL
- Vercel recomienda usar servicios como:
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
  - [PlanetScale](https://planetscale.com/)
  - [Supabase](https://supabase.com/)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👤 Autor

**ExeDevCentral**
- GitHub: [@ExeDevCentral](https://github.com/ExeDevCentral)

---

## 🙏 Agradecimientos

- React Team
- Vercel Team
- Tailwind CSS
- Framer Motion
