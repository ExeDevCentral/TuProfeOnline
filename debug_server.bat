@echo off
echo ==========================================
echo   EDUSTREAM: MODO DEPURACION
echo ==========================================
echo.
echo [1/3] Intentando instalar dependencias del Servidor MANUALMENTE...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion de dependencias del servidor.
    pause
    exit /b
)

echo.
echo [2/3] Verificando Base de Datos...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Fallo Prisma Generate.
    pause
    exit /b
)

echo.
echo [3/3] Iniciando Servidor de prueba...
echo Si esto falla, leera el error aqui mismo.
echo.
npm run dev

echo.
echo ==========================================
echo SI VES ESTO, EL SERVIDOR SE DETUVO.
echo COPIA EL ERROR DE ARRIBA.
echo ==========================================
pause
