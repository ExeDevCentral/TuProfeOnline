@echo off
echo ==========================================
echo      DIAGNOSTICO DE EDUSTREAM
echo ==========================================

echo [1] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] No se encuentra 'node'. Tienes Node.js instalado?
    goto end
) else (
    echo [OK] Node.js detectado.
)

echo.
echo [2] Verificando NPM...
npm --version
if %errorlevel% neq 0 (
    echo [ERROR] No se encuentra 'npm'.
    goto end
) else (
    echo [OK] NPM detectado.
)

echo.
echo [3] Verificando Archivos...
if exist "package.json" (
    echo [OK] package.json encontrado.
) else (
    echo [ERROR] No encuentro package.json. Estas ejecutando esto en la carpeta correcta?
    goto end
)

echo.
echo [4] Verificando Dependencias...
if exist "node_modules" (
    echo [OK] carpeta node_modules encontrada.
) else (
    echo [AVISO] No veo node_modules. Quizas falta ejecutar 'npm install'.
)

echo.
echo ==========================================
echo DIAGNOSTICO COMPLETADO.
echo Si viste algun [ERROR], esa es la causa.
echo ==========================================

:end
pause
