import '../../data/icon-16.png';
import '../../data/icon-48.png';
import '../../data/icon-64.png';

import '../../_locales/en/messages.json';

browser.runtime.onMessage.addListener((message) => {
    switch(message.topic) {
    case "get-elements":
        return browser.tabs.executeScript(message.tabId, {
            file: "content/extract-elements.js",
            runAt: "document_end"
        }).then((r) => r[0]);
    default:
    }
});
