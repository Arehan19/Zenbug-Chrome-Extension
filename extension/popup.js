document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded, waiting for screenshot request");
});

// Listen for screenshot request from iframe
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "REQUEST_SCREENSHOT") {
    console.log("Screenshot requested, capturing active tab");
    captureActiveTab();
  }
});

function captureActiveTab() {
  // Use Chrome's built-in screenshot API instead of html2canvas
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    
    chrome.tabs.captureVisibleTab(activeTab.windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Screenshot failed:", chrome.runtime.lastError);
        return;
      }
      
      console.log("Screenshot captured successfully");
      
      // Send screenshot to iframe form
      const iframe = document.querySelector("iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { type: "SCREENSHOT_FROM_EXTENSION", screenshot: dataUrl },
          "*"
        );
      }
    });
  });
}