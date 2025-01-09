const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS ve body-parser ayarları
app.use(cors());
app.use(bodyParser.json());

// Downloads klasörü
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Video indirme endpoint'i
app.post('/download', async (req, res) => {
    const { url, format } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const outputPath = path.join(downloadsDir, `video_${Date.now()}`);
    const ytDlpPath = path.join(process.cwd(), 'yt-dlp');
    let command;

    if (format === 'mp3') {
        command = `${ytDlpPath} -x --audio-format mp3 -o "${outputPath}.%(ext)s" ${url}`;
    } else {
        command = `${ytDlpPath} -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputPath}.%(ext)s" ${url}`;
    }

    console.log('Executing command:', command);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: 'Download failed', details: error.message });
        }

        console.log(`stdout: ${stdout}`);

        // Dosya adını bul
        fs.readdir(downloadsDir, (err, files) => {
            if (err) {
                console.error(`Directory read error: ${err}`);
                return res.status(500).json({ error: 'Could not read directory' });
            }

            console.log('Files in directory:', files);

            const downloadedFile = files.find(file => file.startsWith(`video_${Date.now()}`));
            if (!downloadedFile) {
                console.error('Downloaded file not found');
                return res.status(404).json({ error: 'File not found' });
            }

            const filePath = path.join(downloadsDir, downloadedFile);
            console.log('Sending file:', filePath);
            
            // Dosyayı gönder
            res.download(filePath, downloadedFile, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err}`);
                }
                
                // Dosyayı sil
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${err}`);
                    }
                });
            });
        });
    });
});

// Root endpoint'i ekle
app.get('/', (req, res) => {
    res.send('YouTube Downloader API is running');
});

// Render'ın atadığı portu kullan
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}); 