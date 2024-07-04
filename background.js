chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookup",
    title: "Look up",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookup") {
    chrome.tabs.sendMessage(tab.id, { text: info.selectionText });
  }
});
