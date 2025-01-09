#!/bin/bash

# Renkli log için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting YouTube Downloader Server...${NC}"

# yt-dlp'yi yükle
echo -e "${YELLOW}Installing yt-dlp...${NC}"
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp
export PATH=$PATH:$(pwd)

# FFmpeg'i yükle
echo -e "${YELLOW}Installing FFmpeg...${NC}"
apt-get update && apt-get install -y ffmpeg

# Downloads klasörünü oluştur
mkdir -p src/server/downloads
chmod 777 src/server/downloads

# Node.js uygulamasını başlat
echo -e "${GREEN}Starting Node.js application...${NC}"
node src/server/server.js 