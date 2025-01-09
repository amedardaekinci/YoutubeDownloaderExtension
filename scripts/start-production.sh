#!/bin/bash

# Renkli log için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Starting YouTube Downloader Server...${NC}"

# yt-dlp'yi yükle
echo -e "${YELLOW}Installing yt-dlp...${NC}"
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# FFmpeg'i yükle
echo -e "${YELLOW}Installing FFmpeg...${NC}"
sudo apt-get update && sudo apt-get install -y ffmpeg

# Downloads klasörünü oluştur
mkdir -p src/server/downloads
sudo chmod 777 src/server/downloads

# Node.js uygulamasını başlat
echo -e "${GREEN}Starting Node.js application...${NC}"
node src/server/server.js 