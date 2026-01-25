@echo off
title EduStream - Sembrar Datos de Prueba
color 0B

echo ===========================================
echo   INSCRIPTANDO DATOS DE PRUEBA (SEED)
echo ===========================================
echo.
echo Esto creara usuarios de prueba:
echo  - Admin: admin@edustream.com / admin123
echo  - Estudiante: estudiante1@edustream.com / student123
echo.
echo Procesando...

cd server
call npm run seed
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] No se pudieron crear los datos. 
    echo Asegurate de que 'EJECUTAR_PROYECTO.bat' ya haya configurado la base de datos antes.
    pause
    exit /b
)

color 0A
echo.
echo [EXITO] Datos creados correctamente.
echo.
echo Ya puedes iniciar sesion con los correos de arriba.
echo.
pause
