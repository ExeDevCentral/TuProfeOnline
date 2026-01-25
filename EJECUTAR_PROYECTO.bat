@echo off
setlocal
title EduStream Launcher
color 0A

echo ===================================================
echo            EDUSTREAM - LANZADOR UNIFICADO
echo ===================================================
echo.
echo Este script se encargara de todo:
echo  1. Verificar herramientas (Node.js)
echo  2. Instalar dependencias (Frontend y Backend)
echo  3. configurar Base de Datos
echo  4. Iniciar el sistema
echo.
echo POR FAVOR NO CIERRES ESTA VENTANA.
echo.
pause

:: ------------------------------------------
:: PASO 1: VERIFICACION
:: ------------------------------------------
echo.
echo [1/4] Verificando entorno...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR CRITICO] Node.js no esta instalado o no se encuentra en el PATH.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b
)
echo [OK] Node.js detectado.

:: ------------------------------------------
:: PASO 2: INSTALACION BACKEND
:: ------------------------------------------
echo.
echo [2/4] Preparando SERVIDOR...
cd server
if not exist ".env" (
    echo [AVISO] Creando archivo .env basico...
    echo PORT=3001> .env
    echo DATABASE_URL="file:./dev.db">> .env
    echo JWT_SECRET="secret_dev_key">> .env
    echo FRONTEND_URL="http://localhost:5173">> .env
)

echo    - Instalando librerias del servidor...
call npm install --no-audit --no-fund --loglevel=error
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Fallo la instalacion del Servidor.
    cd ..
    pause
    exit /b
)

echo    - Configurando Base de Datos...
call npx prisma generate
call npx prisma migrate dev --name init_fix --skip-seed
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] La migracion tuvo problemas. Intentando continuar...
)
cd ..
echo [OK] Servidor listo.

:: ------------------------------------------
:: PASO 3: INSTALACION FRONTEND
:: ------------------------------------------
echo.
echo [3/4] Preparando FRONTEND (Interfaz)...
if not exist ".env" (
    echo [AVISO] Creando archivo .env frontend...
    echo VITE_API_URL="http://localhost:3001/api"> .env
)

echo    - Instalando librerias visuales...
call npm install --legacy-peer-deps --no-audit --no-fund --loglevel=error
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Fallo la instalacion del Frontend.
    pause
    exit /b
)
echo [OK] Frontend listo.

:: ------------------------------------------
:: PASO 4: EJECUCION
:: ------------------------------------------
echo.
echo [4/4] INICIANDO SISTEMA...
echo.
echo Abriendo Servidor API...
start "EduStream - SERVIDOR (No cerrar)" cmd /k "cd server && npm run dev"

echo Abriendo Aplicacion Web...
start "EduStream - APP (No cerrar)" cmd /k "npm run dev"

echo.
echo ===================================================
echo              SISTEMA INICIADO EXITOSAMENTE
echo ===================================================
echo.
echo 1. Se han abierto 2 ventanas negras nuevas. NO LAS CIERRES.
echo 2. Puedes minimizar esta ventana.
echo 3. Ve a tu navegador y entra a: http://localhost:5173
echo.
echo Presiona cualquier tecla para salir de este lanzador...
pause >nul
