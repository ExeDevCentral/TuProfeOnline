@echo off
title EduStream - Subir a GitHub
color 0B

echo ===========================================
echo   SINCRONIZANDO CON GITHUB
echo ===========================================
echo.
echo Repositorio Destino: https://github.com/ExeDevCentral/WebClasesOnlineAmerica
echo.

:: 1. Configurar Remote
echo [1/4] Configurando conexion...
call git remote remove origin 2>nul
call git remote add origin https://github.com/ExeDevCentral/WebClasesOnlineAmerica

:: 2. Preparar Archivos
echo [2/4] Guardando cambios locales...
call git add .
call git commit -m "Solucion Final: Arquitectura Segura, Singleton DB y Scripts Unificados"

:: 3. Asegurar Rama
echo [3/4] Verificando rama principal...
call git branch -M main

:: 4. Subir (Push)
echo [4/4] Subiendo a la nube...
echo.
echo -----------------------------------------------------------
echo SI TE PIDE CREDENCIALES:
echo Usa tu navegador o token personal si salta la ventana.
echo -----------------------------------------------------------
echo.

call git push -u origin main

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] No se pudo subir. 
    echo Posibles causas: 
    echo 1. No tienes internet.
    echo 2. Hubo un conflicto de versiones (alguien mas edito el repo).
    echo 3. Permisos denegados.
    pause
    exit /b
)

color 0A
echo.
echo ===========================================
echo      !SUBIDA EXITOSA! TODO ESTA SEGURO
echo ===========================================
echo.
pause
