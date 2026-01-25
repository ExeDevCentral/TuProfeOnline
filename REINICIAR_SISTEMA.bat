@echo off
title REINICIANDO SISTEMA
color 0C
echo ==============================================
echo   REIINICIO FORZADO DE SERVIDORES
echo ==============================================
echo.
echo 1. Cerrando procesos de Node.js antiguos...
taskkill /F /IM node.exe >nul 2>&1
echo [OK] Procesos detenidos.

echo.
echo 2. Iniciando sistema limpio...
call EJECUTAR_PROYECTO.bat
