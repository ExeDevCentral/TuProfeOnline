# 🎯 Prioridades para Salir a Producción

## 🔥 URGENTE - Hacer AHORA

### 1. Sistema de Autenticación (2-3 días)
```bash
# Opción A: Autenticación propia (Recomendado)
- Implementar JWT
- Login/Registro
- Protección de rutas

# Opción B: Google OAuth (Más rápido)
- Configurar Google Cloud Console
- Obtener Client ID real
- Implementar flujo completo
```

### 2. Base de Datos Básica (1-2 días)
```bash
# Configurar Prisma
cd server
npm install @prisma/client prisma
npx prisma init

# Crear modelos mínimos:
# - User (id, email, password, name, role)
# - Class (id, title, teacherId, startTime, endTime, meetUrl)
```

### 3. API Mínima Funcional (2-3 días)
```javascript
// Endpoints críticos:
POST /api/auth/register
POST /api/auth/login
GET  /api/classes
POST /api/classes
GET  /api/classes/:id
```

### 4. Conectar Frontend con Backend (1 día)
- Actualizar servicios de API
- Implementar contexto de autenticación
- Reemplazar datos hardcodeados

---

## ⚡ IMPORTANTE - Esta Semana

### 5. Variables de Entorno (30 min)
```env
# .env (raíz)
VITE_API_URL=http://localhost:3001/api

# server/.env
PORT=3001
JWT_SECRET=clave-super-secreta-32-caracteres-minimo
DATABASE_URL=file:./dev.db
NODE_ENV=development
```

### 6. Manejo de Errores Básico (1 día)
- Try-catch en todas las llamadas API
- Mensajes de error amigables
- Loading states

### 7. Validación de Datos (1 día)
- Validar inputs en frontend
- Validar en backend (express-validator)
- Sanitizar datos

---

## 📅 Esta Quincena

### 8. Features Core
- CRUD completo de clases
- Sistema de inscripciones
- Mensajería básica

### 9. Testing Básico
- Probar flujo completo
- Fix bugs críticos
- Testing manual exhaustivo

### 10. Preparación para Deploy
- Configurar Vercel
- Base de datos de producción
- Variables de entorno en Vercel

---

## 🎨 Mejoras Post-Lanzamiento

- Optimizaciones de performance
- Tests automatizados
- Features adicionales
- Analytics
- Monitoreo

---

## 📊 Estimación de Tiempo

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Autenticación | 2-3 días | 🔴 Crítica |
| Base de datos | 1-2 días | 🔴 Crítica |
| API básica | 2-3 días | 🔴 Crítica |
| Conexión FE-BE | 1 día | 🔴 Crítica |
| Variables env | 30 min | 🟡 Importante |
| Manejo errores | 1 día | 🟡 Importante |
| Validación | 1 día | 🟡 Importante |
| **TOTAL MVP** | **7-10 días** | |

---

## ✅ Checklist Rápido

Antes de decir "está listo", verifica:

- [ ] ¿Los usuarios pueden registrarse?
- [ ] ¿Los usuarios pueden iniciar sesión?
- [ ] ¿Los datos se guardan en base de datos?
- [ ] ¿Las clases se pueden crear/ver?
- [ ] ¿Los errores se manejan correctamente?
- [ ] ¿Funciona en producción (Vercel)?
- [ ] ¿Las variables de entorno están configuradas?
- [ ] ¿Hay validación de datos?
- [ ] ¿Las rutas están protegidas?

Si todas están ✅, ¡estás listo para MVP! 🚀
