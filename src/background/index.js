import '../../data/icon-48b.png';

import '../../_locales/en/messages.json';
import '../../_locales/de/messages.json';

browser.runtime.onMessage.addListener((message) => {
    switch(message.topic) {
    case "get-elements":
        return browser.tabs.executeScript(message.tabId, {
            file: "content/extract-elements.js",
            runAt: "document_end"
        }).then((r) => r.shift());
    default:
    }
});
