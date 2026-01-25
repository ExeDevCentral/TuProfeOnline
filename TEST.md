# 🧪 Guía de Pruebas - WebClasesOnlineAmerica

## ✅ Estado Actual

### Frontend ✅
- **Puerto**: 5173
- **URL**: http://localhost:5173
- **Estado**: ✅ Funcionando

### Backend ⚠️
- **Puerto**: 3001
- **URL**: http://localhost:3001/api/health
- **Estado**: Necesita iniciarse

---

## 🚀 Cómo Probar la Aplicación

### Opción 1: Solo Frontend (Modo Demo)

El frontend ya está funcionando. Puedes:

1. **Abrir en el navegador**:
   ```
   http://localhost:5173
   ```

2. **Probar funcionalidades**:
   - ✅ Ver la Landing Page
   - ✅ Navegar al Dashboard (botón "Acceder" o "Ver Programación")
   - ✅ Explorar las secciones del Dashboard
   - ✅ Ver animaciones y diseño
   - ⚠️ Login con Google (requiere configuración de Google OAuth)

### Opción 2: Frontend + Backend Completo

#### Paso 1: Iniciar Backend

Abre una terminal y ejecuta:

```bash
cd server
npm run dev
```

Deberías ver:
```
🚀 Server running on http://localhost:3001
📡 Health check: http://localhost:3001/api/health
```

#### Paso 2: Verificar Backend

En otra terminal, prueba el endpoint:

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3001/api/health

# O abre en el navegador:
# http://localhost:3001/api/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "message": "EduStream API is running",
  "timestamp": "2026-01-XX..."
}
```

#### Paso 3: Probar Frontend con Backend

1. Asegúrate de tener un archivo `.env` en la raíz con:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

2. Reinicia el servidor frontend si es necesario:
   ```bash
   npm run dev
   ```

3. Abre http://localhost:5173

---

## 🧪 Pruebas Específicas

### 1. Landing Page
- [ ] Carga correctamente
- [ ] Animaciones funcionan
- [ ] Botón "Comenzar con Google" visible
- [ ] Botón "Ver Programación" navega al dashboard
- [ ] Video de fondo se reproduce

### 2. Dashboard
- [ ] Carga correctamente
- [ ] Navegación entre tabs funciona
- [ ] Botones responden a clicks
- [ ] Calendario se muestra
- [ ] Notificaciones se muestran
- [ ] Botón "Unirse a Google Meet" abre nueva pestaña

### 3. Backend API
- [ ] Health check responde: `/api/health`
- [ ] CORS configurado correctamente
- [ ] Respuestas JSON válidas

---

## 🐛 Solución de Problemas

### Backend no inicia

1. **Verificar dependencias**:
   ```bash
   cd server
   npm install
   ```

2. **Verificar puerto disponible**:
   ```bash
   netstat -ano | findstr :3001
   ```

3. **Iniciar manualmente**:
   ```bash
   cd server
   node src/index.js
   ```

### Frontend no conecta con Backend

1. **Verificar variable de entorno**:
   - Archivo `.env` debe existir
   - `VITE_API_URL=http://localhost:3001/api`

2. **Reiniciar servidor frontend**:
   ```bash
   # Detener (Ctrl+C) y reiniciar
   npm run dev
   ```

### CORS Errors

Si ves errores de CORS, verifica que el backend tenga:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## 📊 Checklist de Funcionalidades

### Frontend
- [x] Landing Page con diseño premium
- [x] Dashboard con navegación
- [x] Animaciones Framer Motion
- [x] Video de fondo
- [x] Responsive design
- [ ] Integración completa con Google OAuth (requiere configuración)

### Backend
- [x] Servidor Express configurado
- [x] Health check endpoint
- [x] CORS configurado
- [ ] Autenticación JWT (pendiente implementar)
- [ ] Base de datos (pendiente configurar)

---

## 🎯 Próximos Pasos

1. **Configurar Google OAuth** (si quieres usar login con Google)
2. **Implementar autenticación propia** (JWT)
3. **Configurar base de datos** (Prisma + SQLite/PostgreSQL)
4. **Agregar más endpoints API**
5. **Conectar frontend con backend completamente**

---

## 💡 Notas

- El frontend funciona independientemente del backend
- El backend es opcional para funcionalidades básicas
- Para producción, necesitarás configurar variables de entorno
- Vercel puede servir tanto frontend como backend
