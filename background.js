// Clicking the toolbar button injects the sorter into the current tab.
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
});
