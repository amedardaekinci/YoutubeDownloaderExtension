<!-- @format -->

# YouTube Video Downloader Chrome Extension

<div align="center">
  <img src="logomuz.ico" alt="YouTube Video Downloader Logo" width="128"/>
  <br>
  <h3>Safe, Open Source, and Privacy-Focused YouTube Video Downloader</h3>
</div>

## Overview

This Chrome extension allows you to download YouTube videos in MP4 format and extract audio in M4A format. It's completely open-source, uses no third-party APIs, and is designed with privacy and security in mind.

## Features

- 🎥 Download videos in MP4 format (up to 1080p)
- 🎵 Extract audio in M4A format (256kbps high-quality)
- 🔒 No third-party services or APIs
- 🚫 No data collection or tracking
- ⚡ Fast and efficient downloads
- 💻 Completely local processing
- 🔍 Open source and transparent
- 🎨 Modern, pixel-perfect UI design

## Security & Privacy

- **100% Open Source**: All code is visible and can be audited
- **No External Dependencies**: Uses only YouTube's official streams
- **Local Processing**: All downloads are processed locally on your machine
- **No Data Collection**: We don't collect or store any user data
- **No Third-Party APIs**: Direct communication with YouTube only
- **Safe & Legal**: Uses permitted methods to access public video streams

## How It Works

### Technical Architecture

1. **Video Detection**:

   - Content script monitors YouTube page navigation
   - Uses DOM manipulation to detect video information
   - Extracts video ID, title, and thumbnail URL

2. **Download Process**:

   - Uses yt-dlp library for stream extraction
   - Direct access to YouTube's public video streams
   - No intermediary servers or third-party services

3. **Video Processing**:

   - MP4 downloads: Combines best quality video and audio streams
   - M4A extraction: Isolates and optimizes audio stream
   - All processing happens locally on user's machine

4. **File Management**:
   - Temporary files are stored in a local downloads folder
   - Automatic cleanup after 1 minute
   - Secure file handling with proper sanitization

## Installation Guide

### System Requirements

- Operating System: Windows 10/11, macOS 10.15+, or Linux
- Node.js: Version 14.x or higher (Required for running the local server)
- Chrome/Firefox: Latest version
- Storage: Minimum 100MB free space
- RAM: Minimum 4GB recommended

### Step-by-Step Installation

1. **Install Node.js**

   ```bash
   # Check if Node.js is installed
   node --version

   # If not installed, download from https://nodejs.org/
   # Choose LTS version
   ```

2. **Install yt-dlp**

   ```bash
   # macOS (using Homebrew)
   brew install yt-dlp

   # Windows (using PowerShell as Administrator)
   winget install yt-dlp

   # Linux (Ubuntu/Debian)
   sudo apt update
   sudo apt install yt-dlp
   ```

3. **Clone the Repository**

   ```bash
   # Using HTTPS
   git clone https://github.com/ekincionthebeat/youtube-downloader.git

   # Navigate to project directory
   cd youtube-downloader
   ```

4. **Install Dependencies**

   ```bash
   # Install required Node.js packages
   npm install
   ```

5. **Start the Local Server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

6. **Load Extension in Browser**

   - Chrome:

     1. Open `chrome://extensions/`
     2. Enable "Developer mode" (top-right)
     3. Click "Load unpacked"
     4. Select the extension directory

   - Firefox:
     1. Open `about:debugging`
     2. Click "This Firefox"
     3. Click "Load Temporary Add-on"
     4. Select manifest.json from the extension directory

## Usage

1. Navigate to any YouTube video
2. Click the extension icon
3. Choose download format:
   - MP4 for video (1080p)
   - M4A for audio (256kbps)
4. Wait for processing
5. Save the file to your computer

## Technical Details

### Components

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Download Engine**: yt-dlp
- **Video Processing**: FFmpeg (built into yt-dlp)

### Architecture

```
├── manifest.json        # Extension configuration
├── popup.html          # Extension UI
├── popup.js            # UI logic
├── content.js          # YouTube page integration
├── background.js       # Background processes
└── server.js          # Local processing server
```

### Security Measures

- Input sanitization for file names
- Secure local file handling
- No external API calls
- Temporary file cleanup
- Proper error handling

## License

MIT License - Feel free to use, modify, and distribute.

## Contact

- GitHub: [ekincionthebeat](https://github.com/ekincionthebeat)
- Discord: ardabeat
