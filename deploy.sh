#!/bin/bash

echo "🚀 FastReado Deployment Starting..."

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata durumunda çık
set -e

echo -e "${YELLOW}📥 Pulling latest changes from Git...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Installing/updating dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building the application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
pm2 restart fastreado || pm2 start ecosystem.config.js

echo -e "${YELLOW}📊 Checking PM2 status...${NC}"
pm2 status

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is running on port 3009${NC}"
echo -e "${GREEN}📱 Access your app at: http://YOUR_SERVER_IP:3009${NC}"