#!/bin/bash

# Script para configurar el proyecto localmente

echo "🚀 Configurando E-Commerce localmente..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend
echo -e "${YELLOW}📦 Configurando Backend...${NC}"
cd back

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${GREEN}✅ Archivo .env creado${NC}"
  echo "⚠️  Por favor edita back/.env con tus valores locales"
fi

echo "📥 Instalando dependencias backend..."
npm install

cd ..

# Frontend
echo ""
echo -e "${YELLOW}🎨 Configurando Frontend...${NC}"
cd front

if [ ! -f ".env.local" ]; then
  echo "NG_APP_API_URL=http://localhost:3000" > .env.local
  echo -e "${GREEN}✅ Archivo .env.local creado${NC}"
fi

echo "📥 Instalando dependencias frontend..."
npm install

cd ..

echo ""
echo -e "${GREEN}✅ Configuración completada!${NC}"
echo ""
echo -e "${YELLOW}Para iniciar el proyecto:${NC}"
echo "1. Backend: cd back && npm run start:dev"
echo "2. Frontend: cd front && npm start"
