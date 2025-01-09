// Function to extract video information
function getVideoInfo() {
  const videoElement = document.querySelector('video');
  if (!videoElement) return null;

  return {
    title: document.title.replace(' - YouTube', ''),
    url: window.location.href,
    duration: videoElement.duration,
    thumbnail: document.querySelector('meta[property="og:image"]')?.content
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoInfo') {
    const videoInfo = getVideoInfo();
    sendResponse(videoInfo);
  }
});

// Add download button to YouTube interface
function addDownloadButton() {
  const menuContainer = document.querySelector('#menu-container');
  if (!menuContainer || document.querySelector('#yt-downloader-btn')) return;

  const downloadBtn = document.createElement('button');
  downloadBtn.id = 'yt-downloader-btn';
  downloadBtn.innerHTML = 'Download';
  downloadBtn.className = 'yt-downloader-btn';
  
  downloadBtn.addEventListener('click', () => {
    const videoInfo = getVideoInfo();
    if (videoInfo) {
      chrome.runtime.sendMessage({ action: 'showDownloadOptions', videoInfo });
    }
  });

  menuContainer.appendChild(downloadBtn);
}

// Initialize
function init() {
  addDownloadButton();
}

// Run initialization
init();

// Watch for page navigation (for YouTube's SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(init, 1000); // Wait for YouTube to load new page content
  }
}).observe(document, { subtree: true, childList: true }); 