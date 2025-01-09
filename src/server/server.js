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
    let command;

    if (format === 'mp3') {
        command = `yt-dlp -x --audio-format mp3 -o "${outputPath}.%(ext)s" ${url}`;
    } else {
        command = `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" -o "${outputPath}.%(ext)s" ${url}`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: 'Download failed' });
        }

        // Dosya adını bul
        fs.readdir(downloadsDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Could not read directory' });
            }

            const downloadedFile = files.find(file => file.startsWith(`video_${Date.now()}`));
            if (!downloadedFile) {
                return res.status(404).json({ error: 'File not found' });
            }

            const filePath = path.join(downloadsDir, downloadedFile);
            
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

// Render'ın atadığı portu veya varsayılan portu kullan
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 