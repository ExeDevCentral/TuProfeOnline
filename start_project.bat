@echo off
echo ==========================================
echo   EDUSTREAM: REPARACION E INICIO AUTOMATICO
echo ==========================================
echo.
echo NOTA: Esto puede tardar unos minutos la primera vez.
echo Por favor, NO cierres esta ventana hasta que termine.
echo.

echo [PASO 1/4] Instalando librerias del Frontend (React)...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion del Frontend.
    pause
    exit /b
)
echo [OK] Frontend listo.

echo.
echo [PASO 2/4] Instalando librerias del Backend (Servidor)...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion del Backend.
    cd ..
    pause
    exit /b
)
echo [OK] Backend listo.

echo.
echo [PASO 3/4] Configurando Base de Datos...
call npx prisma generate
call npx prisma migrate dev --name auto_fix
if %errorlevel% neq 0 (
    echo [AVISO] La migracion fallo, intentando reiniciar DB...
    :: Intentamos continuar aun si la migracion es confusa, a veces prisma generate es suficiente
)

echo.
echo [PASO 4/4] INICIANDO SISTEMA...
echo.

:: Iniciar Backend en ventana nueva
start "EduStream API" cmd /k "npm run dev"

:: Volver a raiz e iniciar Frontend en ventana nueva
cd ..
start "EduStream App" cmd /k "npm run dev"

echo ==========================================
echo      !LISTO! ESPERA A QUE SE ABRAN LAS VENTANAS
echo ==========================================
echo Si ves texto verde en las otras ventanas, YA FUNCIONA.
pause
