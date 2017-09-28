import 'file-loader?name=vendor/[name].[ext]!d3/build/d3.min.js';
import './style.css';
import GraphData from './graph-data';

const gd = new GraphData({
        width: document.body.clientWidth,
        height: document.body.clientHeight
    }),
    getElements = () => {
        browser.runtime.sendMessage({
            topic: "get-elements",
            tabId: browser.devtools.inspectedWindow.tabId
        })
            .then((elements) => {
                gd.setElements(elements);
            })
            .catch(console.error);
    };

window.addEventListener("resize", () => {
    gd.resize({
        width: document.body.clientWidth,
        height: document.body.clientHeight
    });
}, {
    capture: false,
    passive: true
});

browser.devtools.network.onNavigated.addListener(() => {
    gd.reset();
    getElements();
});

getElements();
