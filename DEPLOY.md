# 🚀 Guía de Despliegue - Vercel

Esta guía te ayudará a desplegar **WebClasesOnlineAmerica** en Vercel.

---

## 📋 Prerrequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub: `ExeDevCentral/WebClasesOnlineAmerica`
3. Base de datos (opcional para desarrollo, necesario para producción)

---

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Verificar archivos necesarios

Asegúrate de tener estos archivos en la raíz:
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `package.json` - Dependencias del frontend
- ✅ `server/package.json` - Dependencias del backend
- ✅ `.gitignore` - Archivos a ignorar
- ✅ `api/index.js` - Serverless function para Vercel

### 1.2 Commit y Push

```bash
git add .
git commit -m "Preparar proyecto para Vercel"
git push origin main
```

---

## 🌐 Paso 2: Desplegar en Vercel

### Opción A: Desde el Dashboard de Vercel

1. **Ir a Vercel Dashboard**
   - Visita [vercel.com/dashboard](https://vercel.com/dashboard)
   - Inicia sesión con GitHub

2. **Importar Proyecto**
   - Click en "Add New..." → "Project"
   - Selecciona el repositorio `ExeDevCentral/WebClasesOnlineAmerica`
   - Vercel detectará automáticamente la configuración

3. **Configurar Proyecto**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raíz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install && cd server && npm install`

4. **Variables de Entorno**
   
   Agrega estas variables en "Environment Variables":
   
   ```
   VITE_API_URL=https://tu-app.vercel.app/api
   JWT_SECRET=tu-clave-secreta-super-segura-minimo-32-caracteres
   DATABASE_URL=tu-url-de-base-de-datos
   FRONTEND_URL=https://tu-app.vercel.app
   NODE_ENV=production
   ```
   
   **Importante**: 
   - Marca todas las variables para todos los ambientes (Production, Preview, Development)
   - `JWT_SECRET` debe ser una cadena aleatoria segura
   - `DATABASE_URL` puede ser de Vercel Postgres, PlanetScale, o Supabase

5. **Desplegar**
   - Click en "Deploy"
   - Espera a que termine el build (2-5 minutos)

### Opción B: Desde Vercel CLI

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
   
   Sigue las instrucciones:
   - Link to existing project? **No** (primera vez)
   - Project name: `web-clases-online-america`
   - Directory: `./`
   - Override settings? **No**

4. **Configurar Variables de Entorno**
   ```bash
   vercel env add VITE_API_URL
   vercel env add JWT_SECRET
   vercel env add DATABASE_URL
   vercel env add FRONTEND_URL
   vercel env add NODE_ENV
   ```

5. **Desplegar a Producción**
   ```bash
   vercel --prod
   ```

---

## 🗄️ Paso 3: Configurar Base de Datos

### Opción A: Vercel Postgres (Recomendado)

1. En el dashboard de Vercel, ve a "Storage"
2. Click en "Create Database" → "Postgres"
3. Selecciona el plan (Hobby es gratis)
4. Copia la `DATABASE_URL` y agrégala a las variables de entorno

### Opción B: PlanetScale

1. Crea cuenta en [planetscale.com](https://planetscale.com)
2. Crea una base de datos
3. Copia la connection string
4. Agrégala como `DATABASE_URL` en Vercel

### Opción C: Supabase

1. Crea cuenta en [supabase.com](https://supabase.com)
2. Crea un proyecto
3. Ve a Settings → Database
4. Copia la connection string
5. Agrégala como `DATABASE_URL` en Vercel

---

## 🔄 Paso 4: Configurar Prisma para Producción

Si usas Prisma, actualiza `server/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}
```

Luego ejecuta migraciones (puedes hacerlo desde Vercel o localmente):

```bash
cd server
npx prisma migrate deploy
```

---

## ✅ Paso 5: Verificar Despliegue

1. **Verificar Frontend**
   - Visita `https://tu-app.vercel.app`
   - Debe cargar la landing page

2. **Verificar API**
   - Visita `https://tu-app.vercel.app/api/health`
   - Debe devolver: `{"status":"ok","message":"EduStream API is running"}`

3. **Verificar Logs**
   - En Vercel Dashboard → "Deployments" → Click en el deployment
   - Ve a "Functions" para ver logs del backend
   - Ve a "Build Logs" para ver errores de build

---

## 🐛 Solución de Problemas

### Error: "Module not found"
- Verifica que `server/package.json` tenga todas las dependencias
- Asegúrate de que el build command incluya `cd server && npm install`

### Error: "API route not found"
- Verifica que `vercel.json` tenga la ruta `/api/*` configurada
- Asegúrate de que `api/index.js` exista

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de que la base de datos esté accesible desde internet
- Verifica que las credenciales sean correctas

### Error: "Build timeout"
- El build puede tardar más de 60 segundos
- Considera usar `vercel.json` con `maxDuration`:
  ```json
  {
    "functions": {
      "api/index.js": {
        "maxDuration": 30
      }
    }
  }
  ```

---

## 📝 Notas Adicionales

- **Dominio Personalizado**: Puedes agregar un dominio en Vercel → Settings → Domains
- **Preview Deployments**: Cada PR crea un deployment de preview automáticamente
- **Environment Variables**: Puedes tener diferentes valores para Production, Preview y Development
- **Logs**: Los logs están disponibles en tiempo real en Vercel Dashboard

---

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Serverless Functions](https://vercel.com/docs/functions)

---

¡Listo! Tu aplicación debería estar funcionando en Vercel. 🎉
