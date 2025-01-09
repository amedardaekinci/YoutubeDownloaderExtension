// Tarayıcı API'sini kontrol et ve ayarla
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// YouTube video bilgilerini al
function getVideoInfo() {
  const videoId = new URLSearchParams(window.location.search).get('v');
  if (!videoId) return null;

  // Get the actual video title from the video element
  let title = document.querySelector('#title h1')?.textContent?.trim() || 
              document.querySelector('#container h1')?.textContent?.trim() ||
              document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim();
              
  // If no title found, fall back to document title with cleanup
  if (!title) {
    title = document.title
      .replace(/ - YouTube$/, '')  // Remove "- YouTube"
      .replace(/^\([0-9]+\)\s*/, '')  // Remove "(1)" etc.
      .trim();
  }

  return {
    url: window.location.href,
    title: title,
    videoId: videoId,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
}

// Mesaj dinleyicisi
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getVideoInfo') {
    const videoInfo = getVideoInfo();
    if (videoInfo) {
      sendResponse({ videoInfo });
    } else {
      sendResponse({ error: 'No video found' });
    }
    return true; // Asenkron yanıt için önemli
  }
  return true; // Her zaman true döndür
});

// Background script'e video bilgisini gönder
function notifyBackgroundScript() {
  try {
    const videoInfo = getVideoInfo();
    if (videoInfo) {
      browserAPI.runtime.sendMessage({
        action: 'videoFound',
        video: videoInfo
      }).catch(error => {
        console.error('Failed to send message to background script:', error);
      });
    }
  } catch (error) {
    console.error('Notification error:', error);
  }
}

// Sayfa yüklendiğinde ve URL değiştiğinde kontrol et
window.addEventListener('load', () => {
  try {
    notifyBackgroundScript();
  } catch (error) {
    console.error('Load event error:', error);
  }
});

window.addEventListener('yt-navigate-finish', () => {
  try {
    notifyBackgroundScript();
  } catch (error) {
    console.error('Navigation event error:', error);
  }
}); 