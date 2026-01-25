@echo off
title SUBIR TODO EL PROYECTO A GITHUB
color 0B

echo ================================================
echo   SUBIENDO PROYECTO COMPLETO A GITHUB
echo ================================================
echo.
echo Repositorio: https://github.com/ExeDevCentral/WebClasesOnlineAmerica
echo.

:: Paso 1: Configurar identidad de Git
echo [1/6] Configurando identidad de Git...
git config user.name "ExeDevCentral"
git config user.email "exedevcentral@github.com"
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: No se pudo configurar Git.
    pause
    exit /b 1
)
echo [OK] Identidad configurada.

:: Paso 2: Verificar conexión con el repositorio remoto
echo.
echo [2/6] Verificando conexión con GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/ExeDevCentral/WebClasesOnlineAmerica.git
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: No se pudo conectar con el repositorio.
    pause
    exit /b 1
)
echo [OK] Conexión establecida.

:: Paso 3: Obtener cambios remotos (por si hay algo nuevo)
echo.
echo [3/6] Sincronizando con la nube...
git fetch origin main
echo [OK] Sincronización completada.

:: Paso 4: Añadir todos los archivos
echo.
echo [4/6] Preparando archivos locales...
git add .
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: No se pudieron añadir los archivos.
    pause
    exit /b 1
)
echo [OK] Archivos preparados.

:: Paso 5: Crear commit
echo.
echo [5/6] Creando commit...
git commit -m "Actualización completa del proyecto - Backend JWT + Prisma + Frontend React + Scripts de automatización"
if %errorlevel% equ 0 (
    echo [OK] Commit creado exitosamente.
) else (
    echo [INFO] No hay cambios nuevos para commitear, o ya existe un commit.
)

:: Paso 6: Subir a GitHub
echo.
echo [6/6] Subiendo a GitHub...
echo.
echo -----------------------------------------------------------
echo IMPORTANTE: Si aparece una ventana de autenticación:
echo 1. Inicia sesión con tu cuenta de GitHub
echo 2. Autoriza el acceso
echo -----------------------------------------------------------
echo.

:: Intentar push normal primero
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] La subida normal falló. Intentando con fuerza...
    echo Esto puede pasar si hay conflictos con versiones anteriores.
    echo.
    
    :: Preguntar antes de forzar
    set /p CONFIRMAR="¿Quieres FORZAR la subida? Esto sobrescribirá el repositorio remoto (S/N): "
    if /i "%CONFIRMAR%"=="S" (
        git push -u origin main --force
        if %errorlevel% neq 0 (
            color 0C
            echo.
            echo ================================================
            echo   ERROR CRÍTICO: NO SE PUDO SUBIR
            echo ================================================
            echo.
            echo Posibles causas:
            echo 1. No estás autenticado en GitHub
            echo 2. No tienes permisos en el repositorio
            echo 3. No hay conexión a Internet
            echo 4. El repositorio está protegido
            echo.
            echo Por favor, copia el mensaje de error de arriba
            echo y compártelo para poder ayudarte.
            echo.
            pause
            exit /b 1
        )
    ) else (
        color 0C
        echo Subida cancelada por el usuario.
        pause
        exit /b 1
    )
)

:: Éxito
color 0A
echo.
echo ================================================
echo   ¡ÉXITO! PROYECTO SUBIDO CORRECTAMENTE
echo ================================================
echo.
echo Puedes verificar tus cambios en:
echo https://github.com/ExeDevCentral/WebClasesOnlineAmerica
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
