#!/bin/bash

# Temizlik
rm -rf dist
mkdir -p dist/chrome dist/firefox

# Ortak dosyaları kopyala
cp -r src/extension/assets dist/chrome/
cp -r src/extension/common dist/chrome/
cp -r src/extension/content dist/chrome/
cp -r src/extension/popup dist/chrome/
cp -r src/extension/utils dist/chrome/

cp -r src/extension/assets dist/firefox/
cp -r src/extension/common dist/firefox/
cp -r src/extension/content dist/firefox/
cp -r src/extension/popup dist/firefox/
cp -r src/extension/utils dist/firefox/

# Browser-specific manifest dosyalarını kopyala
cp src/extension/chrome/manifest-chrome.json dist/chrome/manifest.json
cp src/extension/firefox/manifest-firefox.json dist/firefox/manifest.json

# ZIP dosyaları oluştur
cd dist/chrome && zip -r ../youtube-downloader-chrome.zip * && cd ../..
cd dist/firefox && zip -r ../youtube-downloader-firefox.zip * && cd ../..

echo "Build completed! Check the dist folder for extension packages." 