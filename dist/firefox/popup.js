// Tarayıcı API'sini kontrol et ve ayarla
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let currentVideo = null;
let isDownloading = false;

// Hazırlık mesajları
const preparingMessages = [
  'Preparing Download...',
  'Processing Video...',
  'Enhancing Quality...',
  'Almost Ready...',
  'Adding Final Touches...',
  'Optimizing Format...',
  'Initializing Download...',
  'Decoding Stream...',
  'Converting Format...',
  'Boosting Audio Quality...',
  'Fetching Best Quality...',
  'Magic in Progress...',
  'Hold Tight...',
  'Just a Moment...',
  'Processing Magic...'
];

// Rastgele mesaj seçme fonksiyonu
function getRandomMessage() {
  return preparingMessages[Math.floor(Math.random() * preparingMessages.length)];
}

// Mesaj animasyonu
function startPreparingAnimation(button) {
  let dots = '';
  let messageIndex = 0;
  
  const updateMessage = () => {
    if (!isDownloading) return;
    
    dots = dots.length >= 3 ? '' : dots + '.';
    if (dots === '') {
      messageIndex = (messageIndex + 1) % preparingMessages.length;
    }
    
    const message = preparingMessages[messageIndex];
    button.innerHTML = `<span class="download-icon"></span>${message}${dots}`;
  };

  // Her 500ms'de bir mesajı güncelle
  const interval = setInterval(updateMessage, 500);
  
  // Temizleme fonksiyonunu döndür
  return () => clearInterval(interval);
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const tabs = await browserAPI.tabs.query({active: true, currentWindow: true});
    if (tabs[0]) {
      try {
        const response = await browserAPI.tabs.sendMessage(tabs[0].id, {action: 'getVideoInfo'});
        if (response && response.videoInfo) {
          updateVideoInfo(response.videoInfo);
        }
      } catch (error) {
        console.error('Content script communication error:', error);
        showNoVideoMessage();
      }
    }
  } catch (error) {
    console.error('Popup error:', error);
    showNoVideoMessage();
  }
});

function showNoVideoMessage() {
  const container = document.getElementById('videoInfo');
  container.innerHTML = `
    <div class="no-video-message">
      <div class="message-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#7289DA" stroke-width="2"/>
          <path d="M12 8V12" stroke="#7289DA" stroke-width="2" stroke-linecap="round"/>
          <circle cx="12" cy="15" r="1" fill="#7289DA"/>
        </svg>
      </div>
      <div class="message-title">No Video Found</div>
      <div class="message-text">Please open a YouTube video to download</div>
    </div>
  `;
}

function updateVideoInfo(video) {
  const container = document.getElementById('videoInfo');
  
  if (!video) {
    showNoVideoMessage();
    return;
  }

  container.innerHTML = `
    <div class="video-item">
      <div class="thumbnail-container">
        <img class="thumbnail" src="${video.thumbnail}" alt="Video preview">
      </div>
      <div class="video-title">${video.title}</div>
      <div class="download-buttons">
        <button class="download-btn mp4-btn" id="mp4Btn">
          <span class="download-icon"></span>MP4
        </button>
        <button class="download-btn mp3-btn" id="mp3Btn">
          <span class="download-icon"></span>MP3
        </button>
      </div>
      <div class="quality-info">
        MP4: 1080p • MP3: 256kbps
      </div>
    </div>
  `;

  // MP4 indirme butonu
  const mp4Btn = document.getElementById('mp4Btn');
  if (mp4Btn) {
    mp4Btn.addEventListener('click', async () => {
      if (isDownloading) return;
      try {
        isDownloading = true;
        mp4Btn.disabled = true;
        
        // Animasyonu başlat
        const stopAnimation = startPreparingAnimation(mp4Btn);
        
        setTimeout(async () => {
          await browserAPI.runtime.sendMessage({
            action: 'downloadVideo',
            videoInfo: video,
            format: 'mp4'
          });
          
          // Animasyonu durdur
          stopAnimation();
          
          mp4Btn.innerHTML = '<span class="download-icon"></span>MP4';
          mp4Btn.disabled = false;
          isDownloading = false;
        }, 10000);
      } catch (error) {
        console.error('MP4 download error:', error);
        alert('Could not start download. Please try again.');
        mp4Btn.innerHTML = '<span class="download-icon"></span>MP4';
        mp4Btn.disabled = false;
        isDownloading = false;
      }
    });
  }

  // MP3 indirme butonu
  const mp3Btn = document.getElementById('mp3Btn');
  if (mp3Btn) {
    mp3Btn.addEventListener('click', async () => {
      if (isDownloading) return;
      try {
        isDownloading = true;
        mp3Btn.disabled = true;
        
        // Animasyonu başlat
        const stopAnimation = startPreparingAnimation(mp3Btn);
        
        setTimeout(async () => {
          await browserAPI.runtime.sendMessage({
            action: 'downloadVideo',
            videoInfo: video,
            format: 'mp3'
          });
          
          // Animasyonu durdur
          stopAnimation();
          
          mp3Btn.innerHTML = '<span class="download-icon"></span>MP3';
          mp3Btn.disabled = false;
          isDownloading = false;
        }, 10000);
      } catch (error) {
        console.error('MP3 download error:', error);
        alert('Could not start download. Please try again.');
        mp3Btn.innerHTML = '<span class="download-icon"></span>MP3';
        mp3Btn.disabled = false;
        isDownloading = false;
      }
    });
  }
}

// Info butonu için event listener
document.addEventListener('DOMContentLoaded', () => {
  const infoBtn = document.querySelector('.info-btn');
  const infoModal = document.getElementById('infoModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (infoBtn && infoModal && modalOverlay && modalClose) {
    infoBtn.addEventListener('click', () => {
      infoModal.classList.add('active');
      modalOverlay.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
      infoModal.classList.remove('active');
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', () => {
      infoModal.classList.remove('active');
      modalOverlay.classList.remove('active');
    });
  }
}); 