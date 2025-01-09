const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// Downloads klasörünü oluştur
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Başlangıçta mevcut dosyaları temizle
fs.readdir(DOWNLOAD_DIR, (err, files) => {
  if (err) return console.error('Klasör okuma hatası:', err);
  for (const file of files) {
    fs.unlinkSync(path.join(DOWNLOAD_DIR, file));
  }
});

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(DOWNLOAD_DIR));

// Video bilgilerini hızlı şekilde al
async function getVideoInfo(url) {
  const { stdout } = await execAsync(`yt-dlp -j --no-playlist "${url}"`);
  return JSON.parse(stdout);
}

// Dosya adını temizle
function sanitizeFilename(filename) {
  return filename.replace(/[/\\?%*:|"<>]/g, '-').substring(0, 200);
}

app.post('/api/info', async (req, res) => {
  try {
    const info = await getVideoInfo(req.body.url);
    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      videoId: info.id
    });
  } catch (error) {
    console.error('Info error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/download-audio', async (req, res) => {
  try {
    const info = await getVideoInfo(req.body.url);
    const safeTitle = sanitizeFilename(info.title);
    const outputPath = path.join(DOWNLOAD_DIR, `${safeTitle}.m4a`);

    // Optimize edilmiş indirme komutu
    const downloadCmd = [
      'yt-dlp',
      '--no-playlist',
      '--no-warnings',
      '--quiet',
      '--no-check-certificate',
      '--extract-audio',
      '--audio-format m4a',
      '--audio-quality 0',
      '-f 140',
      `--output "${outputPath}"`,
      `"${req.body.url}"`
    ].join(' ');

    await execAsync(downloadCmd);

    // 1 dakika sonra dosyayı sil
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log(`Cleaned up: ${outputPath}`);
      }
    }, 1 * 60 * 1000);

    res.json({
      success: true,
      downloadUrl: `/downloads/${encodeURIComponent(safeTitle)}.m4a`,
      title: info.title
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/download-video', async (req, res) => {
  try {
    const info = await getVideoInfo(req.body.url);
    const safeTitle = sanitizeFilename(info.title);
    const outputPath = path.join(DOWNLOAD_DIR, `${safeTitle}.mp4`);

    // Optimize edilmiş indirme komutu
    const downloadCmd = [
      'yt-dlp',
      '--no-playlist',
      '--no-warnings',
      '--quiet',
      '--no-check-certificate',
      '--format "bv*[ext=mp4][height<=1080]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b"',
      '--merge-output-format mp4',
      `--output "${outputPath}"`,
      `"${req.body.url}"`
    ].join(' ');

    await execAsync(downloadCmd);

    // 1 dakika sonra dosyayı sil
    setTimeout(() => {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log(`Cleaned up: ${outputPath}`);
      }
    }, 1 * 60 * 1000);

    res.json({
      success: true,
      downloadUrl: `/downloads/${encodeURIComponent(safeTitle)}.mp4`,
      title: info.title
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 