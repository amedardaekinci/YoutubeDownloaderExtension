// DOM Elements
const loadingElement = document.getElementById('loading');
const contentElement = document.getElementById('content');
const errorElement = document.getElementById('error');
const titleElement = document.getElementById('title');
const thumbnailElement = document.getElementById('thumbnail');
const downloadMP4Button = document.getElementById('downloadMP4');
const downloadMP3Button = document.getElementById('downloadMP3');

// Show/hide elements
function showLoading() {
  loadingElement.style.display = 'block';
  contentElement.style.display = 'none';
  errorElement.style.display = 'none';
}

function showContent() {
  loadingElement.style.display = 'none';
  contentElement.style.display = 'block';
  errorElement.style.display = 'none';
}

function showError() {
  loadingElement.style.display = 'none';
  contentElement.style.display = 'none';
  errorElement.style.display = 'block';
}

// Get current tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Initialize popup
async function initPopup() {
  showLoading();

  try {
    const tab = await getCurrentTab();
    
    // Check if we're on a YouTube video page
    if (!tab.url.includes('youtube.com/watch')) {
      showError();
      return;
    }

    // Get video information from content script
    chrome.tabs.sendMessage(tab.id, { action: 'getVideoInfo' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        showError();
        return;
      }

      // Update UI with video information
      titleElement.textContent = response.title;
      thumbnailElement.src = response.thumbnail;
      showContent();
    });
  } catch (error) {
    console.error('Error initializing popup:', error);
    showError();
  }
}

// Download handlers
async function handleDownload(format) {
  try {
    const tab = await getCurrentTab();
    
    // Get video information
    chrome.tabs.sendMessage(tab.id, { action: 'getVideoInfo' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        console.error('Error getting video info');
        return;
      }

      // Send download request to background script
      chrome.runtime.sendMessage({
        action: 'downloadVideo',
        url: response.url,
        filename: `${response.title}.${format}`
      }, (response) => {
        if (chrome.runtime.lastError || !response.success) {
          console.error('Download failed:', response?.error || 'Unknown error');
        }
      });
    });
  } catch (error) {
    console.error('Error handling download:', error);
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', initPopup);
downloadMP4Button.addEventListener('click', () => handleDownload('mp4'));
downloadMP3Button.addEventListener('click', () => handleDownload('mp3')); 