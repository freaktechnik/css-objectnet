var waitingPromise, debugee, tab, gd = new graphData({
    width: document.body.clientWidth,
    height: document.body.clientHeight
});


window.addEventListener("resize", function(e) {
    gd.svg
        .attr("width", document.body.clientWidth)
        .attr("height", document.body.clientHeight);

    gd.force.size([document.body.clientWidth, document.body.clientHeight]);
}, false);

window.addEventListener("message", function(event) {
    debugee = event.ports[0];
    debugee.onmessage = function(msg) {
        console.log(msg.data);
        if(msg.data.from == tab) {
            if(msg.data.state == "start") {
                clear();
            }
            if(msg.data.state == "stop") {
                drawPage();
            }
        }
        else if(waitingPromise) {
            waitingPromise(msg.data);
        }
    };

    new Promise(function(resolve, reject) {
        //waits for first hello by the ports
        waitingPromise = resolve;
    }).then(drawPage);
}, false);

function drawPage() {
    waitingPromise = null;
    return new Promise(function(resolve, reject) {
        waitingPromise = resolve;
        debugee.postMessage({
           "to": "root",
           "type": "listTabs"
        });
    }).then(function(tablist) {
        waitingPromise = null;
        tab = tablist.tabs[tablist.selected].actor;
        return new Promise(function(resolve, reject) {
            debugee.postMessage({
                "to": tab,
                "type": "attach"
            });
            debugee.postMessage({
                "to": tablist.tabs[tablist.selected].inspectorActor,
                "type": "getWalker"
            });
            waitingPromise = resolve;
        });
    }).then(function({walker}) {
        waitingPromise = null;
        return new Promise(function(resolve, reject) {
            waitingPromise = resolve;
            debugee.postMessage({
                "to": walker.actor,
                "type": "documentElement"
            });
        }).then(function({node}) {
            waitingPromise = null;
            return new Promise(function(resolve, reject) {
                waitingPromise = resolve;
                debugee.postMessage({
                    "to": walker.actor,
                    "type": "outerHTML",
                    "node": node.actor
                });
            });
        });
    }).then(function(html) {
        waitingPromise = null;
        if(typeof html.value === "string") {
            printHTMLString(html.value);
        }
        else {
            return new Promise(function(resolve, reject) {
                waitingPromise = resolve;
                debugee.postMessage({
                    "to": html.value.actor,
                    "type": "substring",
                    "start": 0,
                    "end": html.value.length
                });
            }).then(function({substring}) {
                printHTMLString(substring);
            });
        }
    });
}

function printHTMLString(html) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(html, "text/html");
    gd.setDom(dom);
}

function clear() {
    gd.svg.selectAll("*").remove();
    gd.nodes = [];
    gd.links = [];
}

