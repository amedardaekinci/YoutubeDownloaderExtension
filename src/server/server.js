const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Güvenlik ayarları
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // her IP için limit
});
app.use(limiter);

// CORS ve body-parser ayarları
app.use(cors({
  origin: '*',  // Tüm originlere izin ver
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'Accept'],
  credentials: true
}));
app.use(bodyParser.json());

// Downloads klasörü
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Video indirme endpoint'i
app.post('/download', async (req, res) => {
    try {
        const { url, format } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const timestamp = Date.now();
        const outputPath = path.join(downloadsDir, `video_${timestamp}`);
        const ytDlpPath = path.join(process.cwd(), 'yt-dlp');

        // yt-dlp'nin varlığını kontrol et
        if (!fs.existsSync(ytDlpPath)) {
            console.error('yt-dlp not found at:', ytDlpPath);
            return res.status(500).json({ error: 'yt-dlp not found' });
        }

        let command;
        if (format === 'mp3') {
            command = `${ytDlpPath} -x --audio-format mp3 -o "${outputPath}.%(ext)s" ${url}`;
        } else {
            command = `${ytDlpPath} -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputPath}.%(ext)s" ${url}`;
        }

        console.log('Executing command:', command);
        console.log('Current working directory:', process.cwd());
        console.log('Downloads directory:', downloadsDir);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Command execution error:', error);
                console.error('stderr:', stderr);
                return res.status(500).json({ 
                    error: 'Download failed', 
                    details: error.message,
                    stderr: stderr
                });
            }

            console.log('stdout:', stdout);

            // Dosya adını bul
            fs.readdir(downloadsDir, (err, files) => {
                if (err) {
                    console.error('Directory read error:', err);
                    return res.status(500).json({ error: 'Could not read directory' });
                }

                console.log('Files in directory:', files);
                const downloadedFile = files.find(file => file.startsWith(`video_${timestamp}`));
                
                if (!downloadedFile) {
                    console.error('Downloaded file not found. Files in directory:', files);
                    return res.status(404).json({ error: 'File not found' });
                }

                const filePath = path.join(downloadsDir, downloadedFile);
                console.log('Sending file:', filePath);
                
                // Dosyayı gönder
                res.download(filePath, downloadedFile, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                    }
                    
                    // Dosyayı sil
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Root endpoint'i ekle
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        message: 'YouTube Downloader API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint'i
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Render'ın atadığı portu kullan
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Current working directory:', process.cwd());
    console.log('Downloads directory:', downloadsDir);
}); 