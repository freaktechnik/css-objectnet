import '../../data/icon-16.png';
import '../../data/icon-48.png';
import '../../data/icon-64.png';

import '../../_locales/en/messages.json';

const tabs = new Set();

browser.runtime.onMessage.addListener((message) => {
    switch(message.topic) {
    case "get-elements":
        return browser.tabs.executeScript(message.tabId, {
            file: "content/extract-elements.js",
            runAt: "document_end"
        }).then((r) => r[0]);
    case "watch":
        tabs.add(message.tabId);
        break;
    case "unwatch":
        tabs.delete(message.tabId);
        break;
    default:
    }
});

browser.tabs.onUpdated.addListener((tabId, change) => {
    if(tabs.has(tabId) && change.status == "loading") {
        browser.runtime.sendMessage({
            topic: "reload",
            tabId
        });
    }
});

browser.tabs.onRemoved.addListener((tabId) => {
    if(tabs.has(tabId)) {
        tabs.remove(tabId);
    }
});
