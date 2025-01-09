// Tarayıcı API'sini kontrol et ve ayarla
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// API URL'si
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://youtubedownloaderextension.onrender.com'
  : 'http://localhost:3000';

// Mesaj dinleyicisi
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'downloadVideo') {
    handleDownload(message.videoInfo, message.format)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Download error:', error);
        sendResponse({ error: error.message });
      });
    return true; // Asenkron yanıt için true döndür
  }
  return false;
});

// İndirme işleyicisi
async function handleDownload(videoInfo, format) {
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoInfo.videoId}`;
    
    // İndirme isteği gönder
    const response = await fetch(`${API_URL}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url: videoUrl,
        format: format 
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'İndirme başlatılamadı');
    }

    const data = await response.json();
    
    // Dosyayı indir
    return browserAPI.downloads.download({
      url: data.downloadUrl,
      filename: `${sanitizeFilename(videoInfo.title)}.${format === 'mp3' ? 'mp3' : 'mp4'}`,
      saveAs: true
    });

  } catch (error) {
    console.error('Download error:', error);
    throw new Error(`İndirme hatası: ${error.message}`);
  }
}

// Dosya adını temizle
function sanitizeFilename(filename) {
  return filename.replace(/[/\\?%*:|"<>]/g, '-').trim();
} 