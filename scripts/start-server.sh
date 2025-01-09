#!/bin/bash

# Renkli log için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Banner
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════╗"
echo "║     YouTube Downloader Server Started      ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

# yt-dlp'nin yüklü olup olmadığını kontrol et
if ! command -v yt-dlp &> /dev/null; then
    echo -e "${YELLOW}yt-dlp bulunamadı. Yükleniyor...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install yt-dlp
    else
        sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
        sudo chmod a+rx /usr/local/bin/yt-dlp
    fi
fi

# Node.js bağımlılıklarını kontrol et ve yükle
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Node.js bağımlılıkları yükleniyor...${NC}"
    npm install
fi

# Server'ı başlat
echo -e "${BLUE}Server başlatılıyor...${NC}"
echo -e "${YELLOW}Server adresi: http://localhost:3000${NC}"
echo -e "${YELLOW}Log kayıtları:${NC}"
echo "----------------------------------------"

# Server'ı nodemon ile başlat (otomatik yeniden başlatma için)
npx nodemon src/server/server.js 