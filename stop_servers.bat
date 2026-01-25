@echo off
echo ==========================================
echo      DETENIENDO SERVIDORES (EduStream)
echo ==========================================

echo Cerrando procesos de Node.js...
taskkill /F /IM node.exe
if %errorlevel% equ 0 (
    echo [OK] Procesos cerrados correctamente.
) else (
    echo [INFO] No se encontraron procesos de Node corriendo (o ya estaban cerrados).
)

echo.
echo Todo limpio. Ya puedes instalar o reiniciar.
pause
