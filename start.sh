#!/bin/bash
echo "🚀 INICIANDO AI TEAM BACKEND"
echo "============================"

# Verificar variables de entorno
if [ ! -f ".env" ]; then
  echo "⚠️  Archivo .env no encontrado. Copiando .env.example..."
  cp .env.example .env
  echo "ℹ️  Por favor, configura tus variables en .env"
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias..."
  npm install
fi

# Ejecutar
echo "🔧 Modo: ${NODE_ENV:-development}"
echo "🌐 Puerto: ${PORT:-10000}"
echo "🤖 Gemini Mode: ${GEMINI_MODE:-simulated}"
echo ""
npm start
