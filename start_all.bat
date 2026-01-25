@echo off
echo Iniciando EduStream...
echo.

echo Iniciando backend...
cd server
start /b npm run dev
cd ..
echo Backend iniciado en http://localhost:3001
echo.

echo Iniciando frontend...
start /b npm run dev
echo Frontend iniciado en http://localhost:5174
echo.

echo Esperando que los servidores inicien...
timeout /t 10 /nobreak > nul

echo.
echo ========================================
echo EduStream listo!
echo Accede a: http://localhost:5174
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul