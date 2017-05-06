import "../../../data/icon-16.png";

browser.devtools.panels.create(
    browser.i18n.getMessage("name"),
    "assets/images/icon-16.png",
    "devtools/panel/index.html"
).then((panel) => {
    panel.onShown.addListener(() => {
        browser.runtime.sendMessage({
            topic: "watch",
            tabId: browser.devtools.inspectedWindow.tabId
        });
    });
    panel.onHidden.addListener(() => {
        browser.runtime.sendMessage({
            topic: "unwatch",
            tabId: browser.devtools.inspectedWindow.tabId
        });
    });
});
