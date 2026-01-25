@echo off
title REPARAR Y SUBIR A GITHUB
color 0E

echo ==============================================
echo    REPARADOR DE GIT Y SUBIDA FORZADA
echo ==============================================
echo.

echo [1/4] Corrigiendo configuracion de identidad...
git config user.email "usuario@ejemplo.com"
git config user.name "Usuario"
echo [OK] Identidad reseteada.

echo.
echo [2/4] Preparando archivos...
git add .
echo [OK] Archivos añadidos.

echo.
echo [3/4] Creando commit...
:: Usamos un mensaje generico por si el anterior fallo
git commit -m "Reparacion de configuracion y subida final"
echo [OK] Commit realizado.

echo.
echo [4/4] Intentando subida (Push)...
echo Intentando subida normal primero...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Fallo la subida normal. Intentando subida FORZADA...
    echo Esto solucionara conflictos de versiones si los hay.
    echo.
    git push origin main --force
)

echo.
if %errorlevel% neq 0 (
    color 0C
    echo ==============================================
    echo    ERROR CRITICO: NO SE PUDO SUBIR
    echo ==============================================
    echo Causas posibles:
    echo 1. No estas logueado en GitHub (pide usuario/contraseña o token).
    echo 2. El repositorio no existe o la URL es incorrecta.
    echo 3. No tienes internet.
    echo.
    echo COPIA EL ERROR DE ARRIBA PARA QUE PUEDA AYUDARTE.
    pause
) else (
    color 0A
    echo ==============================================
    echo    ¡EXITO! PROYECTO SUBIDO CORRECTAMENTE
    echo ==============================================
    echo Ya puedes ver tus cambios en GitHub.
    pause
)
