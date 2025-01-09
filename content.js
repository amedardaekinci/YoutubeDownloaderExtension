// Tarayıcı API'sini kontrol et ve ayarla
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// YouTube video bilgilerini al
function getVideoInfo() {
  try {
    // Video ID'sini al
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (!videoId) {
      console.log('Video ID bulunamadı');
      return null;
    }

    // Video başlığını al - yeni YouTube arayüzü için güncellenmiş selektörler
    let title = document.querySelector('h1.ytd-video-primary-info-renderer yt-formatted-string')?.textContent?.trim() ||
                document.querySelector('#title h1')?.textContent?.trim() || 
                document.querySelector('#container h1')?.textContent?.trim();
    
    // Başlık bulunamadıysa document.title'dan al
    if (!title) {
      title = document.title
        .replace(/ - YouTube$/, '')
        .replace(/^\([0-9]+\)\s*/, '')
        .trim();
    }

    // URL'yi kontrol et
    const url = window.location.href;
    if (!url.includes('youtube.com/watch')) {
      console.log('Geçerli bir YouTube video sayfasında değil');
      return null;
    }

    console.log('Video bilgileri bulundu:', {
      url,
      title,
      videoId
    });

    return {
      url: url,
      title: title,
      videoId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  } catch (error) {
    console.error('getVideoInfo error:', error);
    return null;
  }
}

// Mesaj dinleyicisi
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getVideoInfo') {
    const videoInfo = getVideoInfo();
    if (videoInfo && videoInfo.url && videoInfo.title) {
      console.log('Sending video info:', videoInfo);
      sendResponse({ videoInfo });
    } else {
      console.log('No valid video info found');
      sendResponse({ error: 'No video found' });
    }
    return true;
  }
  return true;
});

// Background script'e video bilgisini gönder
function notifyBackgroundScript() {
  try {
    const videoInfo = getVideoInfo();
    if (videoInfo && videoInfo.url && videoInfo.title) {
      console.log('Notifying background script with video info:', videoInfo);
      browserAPI.runtime.sendMessage({
        action: 'videoFound',
        video: videoInfo
      }).catch(error => {
        console.error('Failed to send message to background script:', error);
      });
    } else {
      console.log('No valid video info to notify');
    }
  } catch (error) {
    console.error('Notification error:', error);
  }
}

// Sayfa yüklendiğinde ve URL değiştiğinde kontrol et
window.addEventListener('load', () => {
  console.log('Page loaded, checking for video...');
  setTimeout(notifyBackgroundScript, 1500); // Sayfanın tam yüklenmesi için biraz bekle
});

// YouTube'un dinamik sayfa geçişlerini yakala
window.addEventListener('yt-navigate-finish', () => {
  console.log('Navigation detected, checking for video...');
  setTimeout(notifyBackgroundScript, 1500); // Sayfanın tam yüklenmesi için biraz bekle
});

// URL değişikliklerini izle
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL changed, checking for video...');
    setTimeout(notifyBackgroundScript, 1500);
  }
}).observe(document, { subtree: true, childList: true }); 