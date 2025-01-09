#!/bin/bash

# Temizlik
rm -rf dist
mkdir -p dist/chrome dist/firefox

# Ortak dosyaları kopyala
cp -r *.js *.html *.png *.mp4 *.webp dist/chrome/
cp -r *.js *.html *.png *.mp4 *.webp dist/firefox/

# Browser-specific manifest dosyalarını kopyala
cp manifest-chrome.json dist/chrome/manifest.json
cp manifest-firefox.json dist/firefox/manifest.json

# ZIP dosyaları oluştur
cd dist/chrome && zip -r ../youtube-downloader-chrome.zip * && cd ../..
cd dist/firefox && zip -r ../youtube-downloader-firefox.zip * && cd ../..

echo "Build completed! Check the dist folder for extension packages." 