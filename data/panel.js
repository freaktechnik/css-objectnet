var waitingPromise, debugee, tab, walkerActor, gd = new graphData({
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
                getOuterHTML(walkerActor).then((dom) => gd.setDom(dom));
            }
        }
        else if(waitingPromise) {
            waitingPromise(msg.data);
        }
    };

    new Promise(function(resolve, reject) {
        //waits for first hello by the ports
        waitingPromise = resolve;
    }).then(function() {
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
            walkerActor = walker.actor;
            return getOuterHTML(walker.actor);
        }).then(dom => gd.setDom(dom));
    });
}, false);

function getOuterHTML(walker) {
    return new Promise(function(resolve, reject) {
        waitingPromise = resolve;
        debugee.postMessage({
            "to": walker,
            "type": "documentElement"
        });
    }).then(function({node}) {
        waitingPromise = null;
        return new Promise(function(resolve, reject) {
            waitingPromise = resolve;
            debugee.postMessage({
                "to": walker,
                "type": "outerHTML",
                "node": node.actor
            });
        });
    }).then(function(html) {
        waitingPromise = null;
        if(typeof html.value === "string") {
            return printHTMLString(html.value);
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
                return printHTMLString(substring);
            });
        }
    });
}

// Create a DOM Document from a string of html
function printHTMLString(html) {
    var parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
}

// Clear the graphData graph.
function clear() {
    gd.svg.selectAll("*").remove();
    gd.nodes = [];
    gd.links = [];
    gd.currentIDNumber = 1;
}

