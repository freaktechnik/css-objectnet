/**
 * @module main
 * @author Martin Giger
 * @license MIT
 */

"use strict";

const { Panel } = require("dev/panel");
const { Tool } = require("dev/toolbox");
const { Class } = require("sdk/core/heritage");
const { get: _ } = require("sdk/l10n");

let ports = new WeakMap();
let portFor = (panel) => ports.get(panel);

const CssObjectPanel = Class({
    extends: Panel,
    label: _('panel_label'),
    tooltip: _('panel_tooltip'),
    icon: './icon-16.png',
    invertIconForLightTheme: true,
    url: './panel.html',
    setup: function(options) {
        ports.set(this, options.debuggee);
    },
    dispose: function() {
        ports.delete(this);
    },
    onReady: function() {
        portFor(this).start();
        this.postMessage("port", [portFor(this)]);
    }
});
exports.CssObjectPanel = CssObjectPanel;

const cssObjectTool = new Tool({
    panels: { cssObjectPanel: CssObjectPanel }
});
