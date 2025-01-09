<!-- @format -->

# YouTube Video Downloader Chrome-Erweiterung

<div align="center">
  <img src="logomuz.ico" alt="YouTube Video Downloader Logo" width="128"/>
  <br>
  <h3>Sicherer, Open Source und datenschutzorientierter YouTube Video Downloader</h3>
</div>

## Übersicht

Diese Chrome-Erweiterung ermöglicht es Ihnen, YouTube-Videos im MP4-Format herunterzuladen und Audio im M4A-Format zu extrahieren. Sie ist vollständig Open Source, verwendet keine Drittanbieter-APIs und wurde mit Fokus auf Datenschutz und Sicherheit entwickelt.

## Funktionen

- 🎥 Videos im MP4-Format herunterladen (bis zu 1080p)
- 🎵 Audio im M4A-Format extrahieren (256kbps Hochqualität)
- 🔒 Keine Drittanbieter-Dienste oder APIs
- 🚫 Keine Datenerfassung oder Tracking
- ⚡ Schnelle und effiziente Downloads
- 💻 Vollständig lokale Verarbeitung
- 🔍 Open Source und transparent
- 🎨 Modernes, pixelperfektes UI-Design

## Sicherheit & Datenschutz

- **100% Open Source**: Gesamter Code ist sichtbar und überprüfbar
- **Keine externen Abhängigkeiten**: Verwendet nur offizielle YouTube-Streams
- **Lokale Verarbeitung**: Alle Downloads werden lokal auf Ihrem Gerät verarbeitet
- **Keine Datenerfassung**: Wir sammeln oder speichern keine Benutzerdaten
- **Keine Drittanbieter-APIs**: Direkte Kommunikation nur mit YouTube
- **Sicher & Legal**: Verwendet erlaubte Methoden für den Zugriff auf öffentliche Video-Streams

## Funktionsweise

### Technische Architektur

1. **Video-Erkennung**:

   - Content-Script überwacht YouTube-Seitennavigation
   - Verwendet DOM-Manipulation zur Erkennung von Video-Informationen
   - Extrahiert Video-ID, Titel und Thumbnail-URL

2. **Download-Prozess**:

   - Verwendet yt-dlp-Bibliothek für Stream-Extraktion
   - Direkter Zugriff auf öffentliche YouTube-Video-Streams
   - Keine Zwischenserver oder Drittanbieter-Dienste

3. **Video-Verarbeitung**:

   - MP4-Downloads: Kombiniert beste Video- und Audio-Streams
   - M4A-Extraktion: Isoliert und optimiert Audio-Stream
   - Gesamte Verarbeitung erfolgt lokal auf dem Gerät des Benutzers

4. **Datei-Management**:
   - Temporäre Dateien werden im lokalen Download-Ordner gespeichert
   - Automatische Bereinigung nach 1 Minute
   - Sichere Dateiverarbeitung mit korrekter Sanitisierung

## Installationsanleitung

### Systemanforderungen

- Betriebssystem: Windows 10/11, macOS 10.15+ oder Linux
- Node.js: Version 14.x oder höher (Erforderlich für lokalen Server)
- Chrome/Firefox: Neueste Version
- Speicher: Mindestens 100MB freier Speicherplatz
- RAM: Mindestens 4GB empfohlen

### Schritt-für-Schritt Installation

1. **Node.js Installation**

   ```bash
   # Überprüfen Sie, ob Node.js installiert ist
   node --version

   # Falls nicht installiert, von https://nodejs.org/ herunterladen
   # LTS-Version wählen
   ```

2. **yt-dlp Installation**

   ```bash
   # macOS (mit Homebrew)
   brew install yt-dlp

   # Windows (PowerShell als Administrator)
   winget install yt-dlp

   # Linux (Ubuntu/Debian)
   sudo apt update
   sudo apt install yt-dlp
   ```

3. **Repository Klonen**

   ```bash
   # Mit HTTPS
   git clone https://github.com/ekincionthebeat/youtube-downloader.git

   # In das Projektverzeichnis wechseln
   cd youtube-downloader
   ```

4. **Abhängigkeiten Installieren**

   ```bash
   # Erforderliche Node.js-Pakete installieren
   npm install
   ```

5. **Lokalen Server Starten**

   ```bash
   # Entwicklungsmodus
   npm run dev

   # Produktionsmodus
   npm start
   ```

6. **Erweiterung im Browser Laden**

   - Chrome:

     1. `chrome://extensions/` öffnen
     2. "Entwicklermodus" aktivieren (oben rechts)
     3. Auf "Entpackte Erweiterung laden" klicken
     4. Erweiterungsverzeichnis auswählen

   - Firefox:
     1. `about:debugging` öffnen
     2. "Dieser Firefox" klicken
     3. "Temporäre Add-on laden" klicken
     4. manifest.json aus dem Erweiterungsverzeichnis auswählen

## Verwendung

1. Zu einem beliebigen YouTube-Video navigieren
2. Auf das Erweiterungssymbol klicken
3. Download-Format wählen:
   - MP4 für Video (1080p)
   - M4A für Audio (256kbps)
4. Verarbeitung abwarten
5. Datei auf Computer speichern

## Technische Details

### Komponenten

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Download-Engine**: yt-dlp
- **Video-Verarbeitung**: FFmpeg (in yt-dlp integriert)

### Architektur

```
├── manifest.json        # Erweiterungskonfiguration
├── popup.html          # Erweiterungs-UI
├── popup.js            # UI-Logik
├── content.js          # YouTube-Seitenintegration
├── background.js       # Hintergrundprozesse
└── server.js          # Lokaler Verarbeitungsserver
```

### Sicherheitsmaßnahmen

- Eingabebereinigung für Dateinamen
- Sichere lokale Dateiverarbeitung
- Keine externen API-Aufrufe
- Temporäre Dateibereinigung
- Angemessene Fehlerbehandlung

## Lizenz

MIT-Lizenz - Frei zur Nutzung, Änderung und Verteilung.

## Kontakt

- GitHub: [ekincionthebeat](https://github.com/ekincionthebeat)
- Discord: ardabeat
