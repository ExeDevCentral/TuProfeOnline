#!/usr/bin/env bash
# ==============================================================================
# Iniciar TuProfeOnline (Backend + Frontend)
# ==============================================================================

PROJECT_DIR="/home/exeq/Proyectos/TuProfeOnline"

echo "🚀 Iniciando backend en http://localhost:3001..."
cd "$PROJECT_DIR/server" && node src/index.js &
BACKEND_PID=$!

echo "⚡ Iniciando frontend en http://localhost:5173..."
cd "$PROJECT_DIR" && npx vite --host &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

echo ""
echo "✅ TuProfeOnline está corriendo:"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend API: http://localhost:3001"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores."
wait
