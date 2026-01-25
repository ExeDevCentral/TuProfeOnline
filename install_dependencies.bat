@echo off
echo ==========================================
echo      INSTALADOR DE DEPENDENCIAS
echo ==========================================

echo [1/2] Instalando dependencias del Frontend...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion del Frontend.
    pause
    exit /b
)

echo.
echo [2/2] Instalando dependencias del Backend...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion del Backend.
    cd ..
    pause
    exit /b
)
cd ..

echo.
echo ==========================================
echo      TODO INSTALADO CORRECTAMENTE
echo ==========================================
echo Ahora puedes probar 'start_project.bat' de nuevo.
pause
