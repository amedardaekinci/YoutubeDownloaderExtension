#!/bin/bash

# Renkli log için
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting YouTube Downloader Server...${NC}"

# Çalışma dizinini kontrol et
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$(dirname "$SCRIPT_DIR")"
echo -e "${YELLOW}Working directory: $(pwd)${NC}"

# yt-dlp'yi yükle
echo -e "${YELLOW}Installing yt-dlp...${NC}"
if ! curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp; then
    echo -e "${RED}Failed to download yt-dlp${NC}"
    exit 1
fi

if ! chmod +x yt-dlp; then
    echo -e "${RED}Failed to make yt-dlp executable${NC}"
    exit 1
fi

# yt-dlp sürümünü kontrol et
echo -e "${YELLOW}Checking yt-dlp version...${NC}"
./yt-dlp --version

# FFmpeg'i yükle
echo -e "${YELLOW}Installing FFmpeg...${NC}"
if ! apt-get update; then
    echo -e "${RED}Failed to update package list${NC}"
    exit 1
fi

if ! apt-get install -y ffmpeg; then
    echo -e "${RED}Failed to install FFmpeg${NC}"
    exit 1
fi

# FFmpeg sürümünü kontrol et
echo -e "${YELLOW}Checking FFmpeg version...${NC}"
ffmpeg -version

# Downloads klasörünü oluştur
echo -e "${YELLOW}Creating downloads directory...${NC}"
mkdir -p src/server/downloads
chmod 777 src/server/downloads

# Node.js uygulamasını başlat
echo -e "${GREEN}Starting Node.js application...${NC}"
node src/server/server.js 