# 🚀 Cómo Probar el Proyecto

## 📋 Pasos Rápidos

### 1. Iniciar el Backend

Abre una terminal y ejecuta:

```powershell
cd server
$env:DATABASE_URL="file:./dev.db"
$env:JWT_SECRET="dev-secret-key-change-this-in-production-min-32-chars"
$env:FRONTEND_URL="http://localhost:5173"
npm run dev
```

O si prefieres usar nodemon:
```powershell
cd server
npm run dev
```

Deberías ver:
```
🚀 Server running on http://localhost:3001
📡 Health check: http://localhost:3001/api/health
🔐 Auth routes: http://localhost:3001/api/auth
📚 Class routes: http://localhost:3001/api/classes
```

### 2. Iniciar el Frontend

Abre **otra terminal** y ejecuta:

```powershell
npm run dev
```

Deberías ver:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 3. Probar la Aplicación

1. **Abre el navegador**: http://localhost:5173

2. **Opciones para probar**:

   **Opción A: Crear cuenta nueva**
   - Click en "Crear Cuenta"
   - Completa el formulario
   - Selecciona tu rol (Estudiante, Profesor o Administrador)

   **Opción B: Usar credenciales de prueba**
   - Click en "Iniciar Sesión"
   - Usa una de estas credenciales:
     - **Estudiante**: `estudiante1@edustream.com` / `student123`
     - **Profesor**: `prof.garcia@edustream.com` / `teacher123`
     - **Admin**: `admin@edustream.com` / `admin123`

3. **Una vez dentro del Dashboard**:
   - Verás tus clases reales de la base de datos
   - Puedes navegar entre las secciones
   - El calendario muestra las clases programadas
   - Puedes hacer búsquedas

## ✅ Verificar que Todo Funciona

### Backend
- Abre: http://localhost:3001/api/health
- Deberías ver: `{"status":"ok","message":"EduStream API is running",...}`

### Frontend
- Abre: http://localhost:5173
- Deberías ver la Landing Page
- Puedes hacer login/registro
- El Dashboard carga datos reales

## 🐛 Si Algo No Funciona

### Backend no inicia
- Verifica que estés en la carpeta `server`
- Verifica que `node_modules` esté instalado: `npm install`
- Verifica que la base de datos exista: `npx prisma migrate dev`

### Frontend no conecta
- Verifica que el backend esté corriendo en el puerto 3001
- Verifica que no haya errores en la consola del navegador
- Verifica la URL de la API en `src/services/api.ts`

### Error de autenticación
- Verifica que el token se esté guardando en localStorage
- Abre las DevTools (F12) y revisa la pestaña Network
- Verifica que las peticiones tengan el header `Authorization: Bearer <token>`

## 📝 Notas

- El servidor backend debe estar corriendo antes que el frontend
- Si cambias algo en el backend, reinicia el servidor
- Los datos de prueba se cargan con `npm run seed` en la carpeta server

## 🎉 ¡Listo para Probar!

Todo está configurado y funcionando. Solo necesitas iniciar ambos servidores y probar el flujo completo.
