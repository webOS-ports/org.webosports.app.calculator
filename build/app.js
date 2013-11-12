
// minifier: path aliases

enyo.path.addPaths({layout: "D://Development/webOS Apps/Development Open webOS/Ports/org.webosports.app.calculator-master/enyo/../lib/layout/", onyx: "D://Development/webOS Apps/Development Open webOS/Ports/org.webosports.app.calculator-master/enyo/../lib/onyx/", onyx: "D://Development/webOS Apps/Development Open webOS/Ports/org.webosports.app.calculator-master/enyo/../lib/onyx/source/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
var t = this.fetchRowNode(e);
t && (this.setupItem(e), t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(e) {
if (this.hasNode()) {
var t = this.node.querySelectorAll('[data-enyo-index="' + e + '"]');
return t && t[0];
}
},
rowForEvent: function(e) {
var t = e.target, n = this.hasNode().id;
while (t && t.parentNode && t.id != n) {
var r = t.getAttribute && t.getAttribute("data-enyo-index");
if (r !== null) return Number(r);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n = t && t.querySelectorAll("#" + e.id);
n = n && n[0], e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i);
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), n;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath, i = r.y;
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath;
e.setScrollY(e.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "enyo.FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
peekWidth: 0,
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
constructor: function() {
this.inherited(arguments), this.peekWidth = this.container.peekWidth != null ? this.container.peekWidth : this.peekWidth;
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o, u = 0; o = n[r]; r++) o.getShowing() && (this.arrangeControl(o, {
left: i + u * this.peekWidth
}), r >= t && (i += o.width + o.marginWidth - this.peekWidth), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
}), u++);
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.DockRightArranger",
kind: "Arranger",
basePanel: !1,
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s;
n.width -= t.left + t.right;
var o = n.width, u = e.length;
this.container.transitionPositions = {};
for (r = 0; s = e[r]; r++) s.width = r === 0 && this.container.basePanel ? o : s.getBounds().width;
for (r = 0; s = e[r]; r++) {
r === 0 && this.container.basePanel && s.setBounds({
width: o
}), s.setBounds({
top: t.top,
bottom: t.bottom
});
for (j = 0; s = e[j]; j++) {
var a;
if (r === 0 && this.container.basePanel) a = 0; else if (j < r) a = o; else {
if (r !== j) break;
a = o - e[r].width;
}
this.container.transitionPositions[r + "." + j] = a;
}
if (j < u) {
var f = !1;
for (k = r + 1; k < u; k++) {
var l = 0;
if (f) l = 0; else if (e[r].width + e[k].width > o) l = 0, f = !0; else {
l = e[r].width;
for (i = r; i < k; i++) {
if (!(l + e[i + 1].width < o)) {
l = o;
break;
}
l += e[i + 1].width;
}
l = o - l;
}
this.container.transitionPositions[r + "." + k] = l;
}
}
}
},
arrange: function(e, t) {
var n, r, i = this.container.getPanels(), s = this.container.clamp(t);
for (n = 0; r = i[n]; n++) {
var o = this.container.transitionPositions[n + "." + s];
this.arrangeControl(r, {
left: o
});
}
},
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged(), this.setAttribute("onscroll", enyo.bubbler);
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 ? t += e.length : enyo.nop, e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (p in this.position) e[t].applyStyle(p, this.position[p] + "px");
},
highlightAnchorPointChanged: function() {
this.highlightAnchorPoint ? this.addClass("pinDebug") : this.removeClass("pinDebug");
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale);
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
this.images.length > 0 && (this.loadImageView(this.index - 1), this.loadImageView(this.index), this.loadImageView(this.index + 1));
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? (this.$["image" + e].src != this.images[e] && this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadImageView(this.index - 1), this.loadImageView(this.index + 1), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
for (var e = 0; e < this.images.length; e++) (e < this.index - 1 || e > this.index + 1) && this.$["image" + e] && this.$["image" + e].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable"
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
ondown: "downHandler",
onclick: ""
},
downHandler: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !0;
},
tap: function(e, t) {
return !this.disabled;
}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling ? this.createComponents(this.childComponents, {
isChrome: !0
}) : enyo.nop, this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop;
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling ? this.getScroller().setShowing(this.showing) : enyo.nop, this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop ? this.getScroller().setMaxHeight(this.maxHeight + "px") : enyo.nop, this.removeClass("onyx-menu-up"), this.floating ? enyo.nop : this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: ""
},
classes: "onyx-menu-item",
tag: "div",
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear), this.$.year.setContent(i);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return this.tapped = !0, this.animateTo(n), !0;
}
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
increment: 0,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcIncrement: function(e) {
return Math.ceil(e / this.increment) * this.increment;
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
if (e.name === "startKnob" && n >= 0) {
if (n <= this.endValue && t.xDirection === -1 || n <= this.endValue) {
this.setBeginValue(n);
var r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r) : r, s = this.calcKnobPercent(i);
this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
}
} else if (e.name === "endKnob" && n <= 100) if (n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue) {
this.setEndValue(n);
var r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r) : r, s = this.calcKnobPercent(i);
this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
if (e.name === "startKnob") {
var n = this.calcRangeRatio(this.beginValue);
this.doChange({
value: n,
startChanged: !0
});
} else if (e.name === "endKnob") {
var n = this.calcRangeRatio(this.endValue);
this.doChange({
value: n,
startChanged: !1
});
}
return !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.removeFlyweightClass(this.controlParent || this, "onyx-highlight", t);
},
statics: {
addFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r !== undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.setClassAttribute(e.getClassAttribute()) : e.addClass(t);
}), e.removeClass(t);
}
},
removeFlyweightClass: function(e, t, n, r) {
var i = n.flyweight;
if (i) {
var s = r !== undefined ? r : n.index;
i.performOnRow(s, function() {
e.hasClass(t) ? e.removeClass(t) : e.setClassAttribute(e.getClassAttribute());
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// webos.js

webos = {
identifier: function() {
var e = PalmSystem.identifier.split(" ");
return {
appID: e[0],
process: e[1]
};
},
launchParams: function() {
return enyo.json.parse(PalmSystem.launchParams || "{}") || {};
},
deviceInfo: function() {
return enyo.json.parse(PalmSystem.deviceInfo);
},
fetchAppRootPath: function() {
var e = window.location.href;
if ("baseURI" in window.document) e = window.document.baseURI; else {
var t = window.document.getElementsByTagName("base");
t.length > 0 && (e = t[0].href);
}
var n = e.match(new RegExp(".*://[^#]*/"));
return n ? n[0] : "";
},
fetchAppInfo: function() {
if (!webos.appInfo) try {
var e, t = webos.fetchAppRootPath() + "appinfo.json";
window.palmGetResource ? e = palmGetResource(t) : e = enyo.xhr.request({
url: t,
sync: !0
}).responseText, webos.appInfo = enyo.json.parse(e);
} catch (n) {
webos.appInfo = undefined;
}
return webos.appInfo;
},
localeInfo: function() {
return {
locale: PalmSystem.locale,
localeRegion: PalmSystem.localeRegion,
phoneRegion: PalmSystem.phoneRegion
};
},
isTwelveHourFormat: function() {
return PalmSystem.timeFormat === "HH12";
},
pasteClipboard: function() {
PalmSystem.paste();
},
getWindowOrientation: function() {
return PalmSystem.screenOrientation;
},
setWindowOrientation: function(e) {
PalmSystem.setWindowOrientation(e);
},
setFullScreen: function(e) {
PalmSystem.enableFullScreenMode(e);
},
indicateNewContent: function(e) {
webos._throbId && (PalmSystem.removeNewContentIndicator(webos._throbId), webos._throbId = undefined), e && (webos._throbId = PalmSystem.addNewContentIndicator());
},
isActivated: function(e) {
return e = e || window, e.PalmSystem ? e.PalmSystem.isActivated : !1;
},
activate: function(e) {
e = e || window, e.PalmSystem && e.PalmSystem.activate();
},
deactivate: function(e) {
e = e || window, e.PalmSystem && e.PalmSystem.deactivate();
},
addBannerMessage: function(e, t, n, r, i, s) {
return PalmSystem.addBannerMessage.apply(PalmSystem, arguments);
},
removeBannerMessage: function(e) {
PalmSystem.removeBannerMessage.apply(PalmSystem, arguments);
},
setWindowProperties: function(e, t) {
arguments.length == 1 && (t = e, e = window), e.PalmSystem && e.PalmSystem.setWindowProperties(t);
},
runTextIndexer: function(e, t) {
return e && e.length > 0 && PalmSystem.runTextIndexer ? PalmSystem.runTextIndexer(e, t) : e;
}
}, window.PalmSystem ? PalmSystem.stageReady() : webos = {}, enyo.webos = webos;

// VirtualKeyboard.js

webos.keyboard = {
types: {
text: 0,
password: 1,
search: 2,
range: 3,
email: 4,
number: 5,
phone: 6,
url: 7,
color: 8
},
isShowing: function() {
return webos.keyboard._isShowing || !1;
},
show: function(e) {
webos.keyboard.isManualMode() && PalmSystem.keyboardShow(e || 0);
},
hide: function() {
webos.keyboard.isManualMode() && PalmSystem.keyboardHide();
},
setManualMode: function(e) {
webos.keyboard._manual = e, PalmSystem.setManualKeyboardEnabled(e);
},
isManualMode: function() {
return enyo.webOS.keyboard._manual || !1;
},
forceShow: function(e) {
webos.keyboard.setManualMode(!0), PalmSystem.keyboardShow(inType || 0);
},
forceHide: function() {
webos.keyboard.setManualMode(!0), PalmSystem.keyboardHide();
}
}, window.PalmSystem && enyo.platform.webos && enyo.platform.webos >= 3 ? (Mojo = window.Mojo || {}, Mojo.keyboardShown = function(e) {
webos.keyboard._isShowing = e, enyo.Signals.send("onvirtualkeyboard", {
type: "virtualkeyboard",
showing: e
});
}) : webos.keyboard = undefined;

// SymKey.js

enyo.platform.webos && enyo.platform.webos < 3 && enyo.singleton({
name: "enyo.SymKey",
kind: enyo.Component,
components: [ {
kind: "enyo.Signals",
onkeydown: "keydown",
onrelaunch: "relaunch"
} ],
show: function(e) {
this.symKeyTarget = e || document, this.request = new webOS.ServiceRequest({
service: "palm://com.palm.applicationManager",
method: "launch"
}), this.request.error(this, "serviceFailure"), request.go({
id: "com.palm.systemui",
params: {
action: "showAltChar"
}
});
},
keydown: function(e, t) {
t.keyCode === 17 && this.show(t.target);
},
serviceFailure: function(e, t) {
enyo.error(enyo.json.stringify(t));
},
relaunch: function(e, t) {
var n = enyo.json.parse(PalmSystem.launchParams).altCharSelected;
if (!n) return !1;
var r, i, s;
r = window.getSelection(), r && r.rangeCount > 0 && r.getRangeAt(0) && document.execCommand("insertText", !0, n), s = n.charCodeAt(0), this.sendFakeKey("keydown", s), this.sendFakeKey("keypress", s), this.sendFakeKey("keyup", s);
},
sendFakeKey: function(e, t) {
var n = document.createEvent("Events");
return n.initEvent(type, !0, !0), n.keyCode = t, n.charCode = t, n.which = t, this.symKeyTarget.dispatchEvent(n), n;
}
}), webos.showSymTable = function(e) {
enyo.platform.webos && enyo.platform.webos < 3 && enyo.SymKey.show(e);
};

// LunaBindings.js

window.PalmSystem && (Mojo = window.Mojo || {}, Mojo.stageActivated = function() {
enyo.Signals.send("onactivate");
}, Mojo.stageDeactivated = function() {
enyo.Signals.send("ondeactivate");
}, Mojo.relaunch = function() {
var e = webos.launchParams();
return e["palm-command"] == "open-app-menu" ? enyo.Signals.send("onmenubutton") : enyo.Signals.send("onrelaunch", e), !0;
}, Mojo.show = function() {
enyo.Signals.send("onappshown");
}, Mojo.hide = function() {
enyo.Signals.send("onapphide");
}, Mojo.lowMemoryNotification = function(e) {
enyo.Signals.send("onlowmemory", {
type: "lowmemory",
state: e.state
});
});

// BackGesture.js

(function() {
enyo.dispatcher.listen(document, "keyup", function(e) {
(e.keyCode == 27 || e.keyIdentifier == "U+1200001" || e.keyIdentifier == "U+001B" || e.keyIdentifier == "Back") && enyo.Signals.send("onbackbutton", e);
});
})();

// ApplicationEvents.js

enyo.kind({
name: "enyo.ApplicationEvents",
kind: enyo.Signals,
onbackbutton: "",
onactivate: "",
ondeactivate: "",
onmenubutton: "",
onrelaunch: "",
onlowmemory: "",
onvirtualkeyboard: ""
});

// ServiceRequest.js

enyo.kind({
name: "enyo.ServiceRequest",
kind: enyo.Async,
resubscribeDelay: 1e4,
published: {
service: "",
method: "",
subscribe: !1,
resubscribe: !1
},
constructor: function(e) {
enyo.mixin(this, e), this.inherited(arguments), enyo._serviceCounter == undefined ? enyo._serviceCounter = 1 : enyo._serviceCounter++, this.id = enyo._serviceCounter;
},
go: function(e) {
if (!PalmServiceBridge) return this.fail({
errorCode: -1,
errorText: "Invalid device for Palm services. PalmServiceBridge not found."
}), undefined;
this.params = e || {}, this.bridge = new PalmServiceBridge, this.bridge.onservicecallback = this.clientCallback = enyo.bind(this, "serviceCallback");
var t = this.service;
return this.method.length > 0 && (t.charAt(t.length - 1) != "/" && (t += "/"), t += this.method), this.subscribe && (this.params.subscribe = this.subscribe), this.bridge.call(t, enyo.json.stringify(this.params)), this;
},
cancel: function() {
this.cancelled = !0, this.responders = [], this.errorHandlers = [], this.resubscribeJob && enyo.job.stop(this.resubscribeJob), this.bridge && (this.bridge.cancel(), this.bridge = undefined);
},
serviceCallback: function(e) {
var t, n;
if (this.cancelled) return;
try {
t = enyo.json.parse(e);
} catch (r) {
var n = {
errorCode: -1,
errorText: e
};
this.serviceFailure(n);
return;
}
t.errorCode || t.returnValue === !1 ? this.serviceFailure(t) : this.serviceSuccess(t);
},
serviceSuccess: function(e) {
var t = undefined;
this.responders.length > 0 && (t = this.responders[0]), this.respond(e), this.subscribe && t && this.response(t);
},
serviceFailure: function(e) {
var t = undefined;
this.errorHandlers.length > 0 && (t = this.errorHandlers[0]), this.fail(e), this.resubscribe && this.subscribe && (t && this.error(t), this.resubscribeJob = this.id + "resubscribe", enyo.job(this.resubscribeJob, enyo.bind(this, "goAgain"), this.resubscribeDelay));
},
goAgain: function() {
this.go(this.params);
}
});

// PalmService.js

enyo.kind({
name: "enyo.PalmService",
kind: enyo.Component,
published: {
service: "",
method: "",
subscribe: !1,
resubscribe: !1
},
events: {
onResponse: "",
onError: "",
onComplete: ""
},
create: function() {
this.inherited(arguments), this.activeRequests = [], this.activeSubscriptionRequests = [];
},
send: function(e) {
var t = new enyo.ServiceRequest({
service: this.service,
method: this.method,
subscribe: this.subscribe,
resubscribe: this.resubscribe
});
return t.originalCancel = t.cancel, t.cancel = enyo.bind(this, "cancel", t), t.response(this, "requestSuccess"), t.error(this, "requestFailure"), this.subscribe ? (e.subscribe = this.subscribe, this.activeSubscriptionRequests.push(t)) : this.activeRequests.push(t), t.go(e), t;
},
cancel: function(e) {
this.removeRequest(e), e.originalCancel();
},
removeRequest: function(e) {
var t = -1;
t = this.activeRequests.indexOf(e), t !== -1 ? this.activeRequests.splice(t, 1) : (t = this.activeSubscriptionRequests.indexOf(e), t !== -1 && this.activeSubscriptionRequests.splice(t, 1));
},
requestSuccess: function(e, t) {
this.doResponse({
request: e,
data: t
}), this.requestComplete(e, t);
},
requestFailure: function(e, t) {
this.doError({
request: e,
data: t
}), this.requestComplete(e, t);
},
requestComplete: function(e, t) {
var n = -1;
n = this.activeRequests.indexOf(e), n !== -1 && this.activeRequests.splice(n, 1), this.doComplete({
request: e,
data: t
});
},
destroy: function() {
var e;
for (e = 0; e < this.activeRequests.length; e++) this.activeRequests[e].originalCancel();
delete this.activeRequests;
for (e = 0; e < this.activeSubscriptionRequests.length; e++) this.activeSubscriptionRequests[e].originalCancel();
delete this.activeSubscriptionRequests, this.inherited(arguments);
}
});

// ProgressOrb.js

enyo.kind({
name: "enyo.Pie",
published: {
angle: 0
},
style: "width: 90%; height: 90%;",
components: [ {
name: "PieBackground",
tag: "div",
classes: "pie pie-background"
}, {
name: "LeftMask",
classes: "pie",
components: [ {
name: "PieLeftHalf",
classes: "pie pie-foreground"
} ]
}, {
name: "RightMask",
classes: "pie",
components: [ {
name: "PieRightHalf",
classes: "pie pie-foreground"
} ]
} ],
rendered: function() {
this.setupClipping(), this.applyRotation();
},
angleChanged: function() {
this.applyRotation();
},
setupClipping: function() {
var e = this.hasNode().clientWidth;
this.$.LeftMask.addStyles("clip: rect(0, " + e / 2 + "px, " + e + "px, 0);"), this.$.PieLeftHalf.addStyles("clip: rect(0," + e / 2 + "px" + "," + e + "px" + ",0);"), this.$.RightMask.addStyles("clip: rect(0," + e + "px" + "," + e + "px" + "," + e / 2 + "px" + ");"), this.$.PieRightHalf.addStyles("clip: rect(0," + e + "px" + "," + e + "px" + "," + e / 2 + "px" + ");");
},
applyRotation: function() {
this.$.PieRightHalf.addStyles("-webkit-transform: rotateZ(" + Math.min(this.angle - 180, 0) + "deg);"), this.$.PieLeftHalf.addStyles("-webkit-transform: rotateZ(" + Math.max(this.angle, 180) + "deg);");
}
}), enyo.kind({
name: "enyo.ProgressOrb",
fit: !0,
published: {
value: 0,
min: 0,
max: 1e3
},
style: "position: absolute; width: 48px; height: 48px;",
events: {
onButtonTap: ""
},
components: [ {
name: "ProgressAnimator",
kind: "Animator",
duration: 500,
onStep: "animatorStep"
}, {
name: "OuterRing",
style: "width: 90%; height: 90%; padding: 5%; background-color: #000; border-radius: 50%;",
components: [ {
name: "Pie",
kind: "Pie",
style: "position: absolute;"
}, {
name: "CenterButton",
kind: "onyx.Button",
classes: "onyx-toolbar",
style: "position: absolute; width:65%; height: 65%; margin: 12.5%; padding: 0; border-radius: 50%;",
ontap: "buttonTapped"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.CenterButton.applyStyle("font-size", this.$.CenterButton.hasNode().clientHeight / 2 + "px"), this.$.CenterButton.setContent(this.content);
},
buttonTapped: function() {
this.doButtonTap();
},
valueChanged: function() {
var e = this.$.ProgressAnimator.value;
this.$.ProgressAnimator.setStartValue(e != undefined ? e : 0), this.$.ProgressAnimator.setEndValue(this.value), this.$.ProgressAnimator.play();
},
animatorStep: function(e) {
var t = 0, n = 1, r = this.max, i = this.min, s = r - i, o = n - t, u = o * (e.value - i) / s + t, u = Math.max(Math.min(u, n), t), a = 360 * u;
this.$.Pie.setAngle(a);
}
});

// NumberPad.js

enyo.kind({
name: "enyo.NumberPad",
layoutKind: "FittableRowsLayout",
events: {
onKeyTapped: ""
},
defaultKind: enyo.kind({
kind: "onyx.Button",
classes: "onyx-toolbar",
style: "width: 33.3%; height: 25%; font-size: 32pt; font-weight: bold;",
ontap: "keyTapped"
}),
components: [ {
content: "1",
style: "border-radius: 16px 0 0 0;"
}, {
content: "2",
style: "border-radius: 0;"
}, {
content: "3",
style: "border-radius: 0 16px 0 0;"
}, {
content: "4",
style: "border-radius: 0;"
}, {
content: "5",
style: "border-radius: 0;"
}, {
content: "6",
style: "border-radius: 0;"
}, {
content: "7",
style: "border-radius: 0;"
}, {
content: "8",
style: "border-radius: 0;"
}, {
content: "9",
style: "border-radius: 0;"
}, {
content: "*",
style: "border-radius: 0 0 0 16px;"
}, {
content: "0",
style: "border-radius: 0;"
}, {
content: "#",
style: "border-radius: 0 0 16px 0;"
} ],
keyTapped: function(e) {
this.doKeyTapped({
value: e.content
});
}
});

// CrossAppUI.js

enyo.kind({
name: "enyo.CrossAppUI",
tag: "iframe",
style: "border: 0;",
published: {
app: "",
path: "",
params: null
},
events: {
onResult: ""
},
create: function() {
this.inherited(arguments), this.params = this.params || {}, this.appPath = "", this.checkLoadBound = enyo.bind(this, "checkLoad"), this.handleMessageBound = enyo.bind(this, "handleMessage"), window.addEventListener("message", this.handleMessageBound);
},
destroy: function() {
window.removeEventListener("message", this.handleMessageBound), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.app ? this.appChanged() : this.path && this.pathChanged();
},
appChanged: function() {
this.appPath = "";
if (this.app) {
var e = new enyo.ServiceRequest({
service: "palm://com.palm.applicationManager",
method: "getAppBasePath"
});
e.response(this, "gotAppInfo"), e.go({
appId: this.app
});
} else this.pathChanged();
},
gotAppInfo: function(e) {
if (!e || !e.returnValue) {
console.error("Could not get app path: " + (e && e.errorText));
return;
}
this.appPath = e.basePath, this.appPath = this.appPath || "", this.appPath && (this.appPath = this.appPath.slice(0, this.appPath.lastIndexOf("/") + 1), this.pathChanged());
},
pathChanged: function() {
var e = "";
this.path && (this.appPath ? e = this.appPath + this.path : this.app || (e = this.path), e && (enyo.log("CrossAppUI: Loading cross-app UI at " + e), e = e + "?enyoWindowParams=" + encodeURIComponent(JSON.stringify(this.params)), this._checkLoadTimerId || (this._checkLoadTimerId = window.setTimeout(this.checkLoadBound, 1e3)))), this.setSrc(e);
},
checkLoad: function() {
var e = this.hasNode(), t = e && e.contentDocument;
this._checkLoadTimerId = undefined, t && t.readyState === "complete" && t.location.href === "about:blank" && this.path ? (console.log("CrossAppUI: checkLoad: Kicking iframe."), this.pathChanged()) : console.log("CrossAppUI: checkLoad: things look okay.");
},
paramsChanged: function() {
this.path && this.hasNode() && this.hasNode().contentWindow && this.hasNode().contentWindow.postMessage("enyoWindowParams=" + enyo.json.stringify(this.params), "*");
},
handleMessage: function(e) {
enyo.log(JSON.stringify(e.data));
var t = "enyoCrossAppResult=";
e.source === (this.hasNode() && this.hasNode().contentWindow) && e.data.indexOf(t) === 0 && this.doResult(JSON.parse(e.data.slice(t.length)));
}
});

// FilePicker.js

enyo.kind({
name: "enyo.FilePicker",
kind: "onyx.Popup",
style: "width: 450px; height: 80%;",
published: {
fileType: undefined,
previewLabel: undefined,
extensions: undefined,
allowMultiSelect: !1,
currentRingtonePath: undefined,
cropWidth: undefined,
cropHeight: undefined
},
events: {
onPickFile: ""
},
autoDismiss: !1,
floating: !0,
centered: !0,
modal: !0,
scrim: !0,
filePickerPath: "/usr/lib/luna/system/luna-systemui/app/FilePicker/filepicker.html",
components: [ {
name: "CrossApp",
kind: "CrossAppUI",
style: "width: 100%; height: 100%;",
onResult: "handleResult"
} ],
pickFile: function() {
this.updateParams(), this.$.CrossApp.setPath(this.filePickerPath), this.show();
},
updateParams: function() {
var e = {}, t = this;
Object.keys(this.published).forEach(function(n) {
t[n] !== undefined && (e[n] = t[n]);
}), this.fileType && typeof this.fileType != "string" && (e.fileTypes = this.fileType, e.fileType = undefined), this.$.CrossApp.setParams(e);
},
handleResult: function(e, t) {
this.$.CrossApp.setPath(""), this.hide(), t.result && this.doPickFile(t.result);
}
});

// AppMenu.js

enyo.kind({
name: "enyo.AppMenu",
kind: onyx.Menu,
classes: "enyo-appmenu",
defaultKind: "enyo.AppMenuItem",
published: {
maxHeight: 400
},
components: [ {
kind: enyo.Signals,
onmenubutton: "toggle"
} ],
toggle: function() {
this.showing ? this.hide() : this.show();
},
show: function() {
var e = 30 * this.controls.length - 1;
e > this.maxHeight && (e = this.maxHeight), this.setBounds({
height: e
}), this.inherited(arguments);
},
maxHeightChanged: function() {
this.showing && this.show();
}
}), enyo.kind({
name: "enyo.AppMenuItem",
kind: onyx.MenuItem,
classes: "enyo-item"
});

// HtmlContent.js

enyo.kind({
name: "enyo.HtmlContent",
kind: enyo.Control,
tag: "div",
allowHtml: !0
});

// ModalDialog.js

enyo.kind({
name: "enyo.ModalDialog",
kind: onyx.Popup,
modal: !0,
autoDismiss: !1,
openAtCenter: function() {
this.setCentered(!0), this.show();
}
});

// WebView.js

enyo.weightedAverage = {
data: {},
count: 4,
weights: [ 1, 2, 4, 8 ],
compute: function(e, t) {
this.data[t] || (this.data[t] = []);
var n = this.data[t];
n.push(e), n.length > this.count && n.shift();
for (var r = 0, i = 0, s = 0, o, u; (o = n[r]) && (u = this.weights[r]); r++) s += o * u, i += u;
return i = i || 1, s /= i, s;
},
clear: function(e) {
this.data[e] = [];
}
}, enyo.kind({
name: "enyo.BasicWebView",
kind: enyo.Control,
tag: "object",
published: {
identifier: "",
url: "",
minFontSize: 16,
enableJavascript: !0,
blockPopups: !0,
acceptCookies: !0,
headerHeight: 0,
redirects: [],
systemRedirects: [],
networkInterface: "",
dnsServers: [],
ignoreMetaTags: !1,
cacheAdapter: !0
},
attributes: {
tabIndex: 0
},
handlers: {
onblur: "blurHandler"
},
requiresDomMousedown: !0,
events: {
onMousehold: "",
onResized: "",
onPageTitleChanged: "",
onUrlRedirected: "",
onSingleTap: "",
onLoadStarted: "",
onLoadProgress: "",
onLoadStopped: "",
onLoadComplete: "",
onFileLoad: "",
onAlertDialog: "",
onConfirmDialog: "",
onPromptDialog: "",
onSSLConfirmDialog: "",
onUserPasswordDialog: "",
onOpenSelect: "",
onNewPage: "",
onPrint: "",
onEditorFocusChanged: "",
onScrolledTo: "",
onConnected: "",
onDisconnected: "",
onError: ""
},
lastUrl: "",
domStyles: {
display: "block",
"-webkit-transform": "translate3d(0, 0, 0)"
},
create: function() {
this.inherited(arguments), this.history = [], this.callQueue = [], this.dispatcher = enyo.dispatcher, this.setAttribute("type", "application/x-palm-browser"), this.setAttribute("x-palm-cache-plugin", this.cacheAdapter), this._flashGestureLock = !1;
},
destroy: function() {
this.callQueue = null, this.node.eventListener = null, this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.hasNode() && (this.node.eventListener = this, this.node.addEventListener("touchstart", enyo.bind(this, "touchHandler")), this.node.addEventListener("touchmove", enyo.bind(this, "touchHandler")), this.node.addEventListener("touchend", enyo.bind(this, "touchHandler")), this.history = [], this.lastUrl = "", this.adapterReady() && this.connect());
},
blurHandler: function() {
window.PalmSystem && window.PalmSystem.editorFocused(!1, 0, 0);
},
touchHandler: function() {},
adapterReady: function() {
return this.hasNode() && this.node.openURL;
},
adapterInitialized: function() {
this._serverConnected = !1, this.connect();
},
serverConnected: function() {
this._serverConnected = !0, this.initView(), this.doConnected();
},
connect: function() {
this.adapterReady() && !this._serverConnected && this._connect();
},
_connect: function() {
try {
this.node.setPageIdentifier(this.identifier || this.id), this.node.connectBrowserServer();
} catch (e) {}
},
initView: function() {
this.adapterReady() && this._serverConnected && (this.cacheBoxSize(), this.node.interrogateClicks(!1), this.node.setShowClickedLink(!0), this.node.pageFocused(!0), this.blockPopupsChanged(), this.acceptCookiesChanged(), this.enableJavascriptChanged(), this.systemRedirectsChanged(), this.redirectsChanged(), this.updateViewportSize(), this.minFontSizeChanged(), this.urlChanged());
},
resize: function() {
var e = this.getBounds();
this._boxSize && (this._boxSize.width != e.width || this._boxSize.height != e.height) && this.cacheBoxSize(), this.updateViewportSize();
},
getBounds: function() {
var e = this.owner.owner.getBounds(), t = 0, n = 0, r = 0, i = 0, s = 0;
return this.owner.owner.hasNode() && (t = enyo.dom.getComputedStyleValue(this.owner.owner.node, "padding-top").replace("px", ""), n = enyo.dom.getComputedStyleValue(this.owner.owner.node, "padding-left").replace("px", ""), r = enyo.dom.getComputedStyleValue(this.owner.owner.node, "padding-right").replace("px", ""), i = enyo.dom.getComputedStyleValue(this.owner.owner.node, "padding-bottom").replace("px", ""), s = enyo.dom.getComputedStyleValue(this.owner.owner.node, "border-top-width").replace("px", "")), s = parseInt(s, 10), {
width: e.width - (parseInt(n, 10) + parseInt(r, 10)) - s * 2,
height: e.height - (parseInt(t, 10) + parseInt(i, 10)) - s * 2
};
},
cacheBoxSize: function() {
this._boxSize = this.getBounds(), this.applyStyle("width", this._boxSize.width + "px"), this.applyStyle("height", this._boxSize.height + "px");
},
updateViewportSize: function() {
var e = this.getBounds();
e.width && e.height && this.callBrowserAdapter("setVisibleSize", [ e.width, e.height ]);
},
urlChanged: function() {
this.url && this.callBrowserAdapter("openURL", [ this.url ]);
},
minFontSizeChanged: function() {
this.callBrowserAdapter("setMinFontSize", [ Number(this.minFontSize) ]);
},
dispatchDomEvent: function(e) {
var t = !0, n = e.type == "gesturechange" || e.type == "gesturestart" || e.type == "gestureend", r = e.centerX || e.clientX || e.pageX, i = e.centerY || e.clientY || e.pageY;
if (e.preventDefault && (r < 0 || i < 0)) return e.preventDefault(), !0;
if (n || !this._flashGestureLock && !this._mouseInInteractive || this._flashGestureLock && !this._mouseInFlash) t = this.inherited(arguments);
return t;
},
dragstartHandler: function() {
return !0;
},
flickHandler: function(e, t) {
return this.callBrowserAdapter("handleFlick", [ t.xVel, t.yVel ]), !0;
},
enableJavascriptChanged: function() {
this.callBrowserAdapter("setEnableJavaScript", [ this.enableJavascript ]);
},
blockPopupsChanged: function() {
this.callBrowserAdapter("setBlockPopups", [ this.blockPopups ]);
},
acceptCookiesChanged: function() {
this.callBrowserAdapter("setAcceptCookies", [ this.acceptCookies ]);
},
headerHeightChanged: function() {
this.callBrowserAdapter("setHeaderHeight", [ this.headerHeight ]);
},
systemRedirectsChanged: function(e) {
this._redirectsChanged(this.systemRedirects, e);
},
redirectsChanged: function(e) {
this._redirectsChanged(this.redirects, e);
},
_redirectsChanged: function(e, t) {
for (var n = 0, r; r = t && t[n]; n++) this.callBrowserAdapter("addUrlRedirect", [ r.regex, !1, r.cookie, r.type || 0 ]);
for (n = 0, r; r = e[n]; n++) this.callBrowserAdapter("addUrlRedirect", [ r.regex, r.enable, r.cookie, r.type || 0 ]);
},
networkInterfaceChanged: function() {
this.networkInterface && this.callBrowserAdapter("setNetworkInterface", [ this.networkInterface ]);
},
dnsServersChanged: function() {
if (this.networkInterface) {
var e = this.dnsServers.join(",");
this.callBrowserAdapter("setDNSServers", [ e ]);
}
},
ignoreMetaTagsChanged: function() {
this.callBrowserAdapter("ignoreMetaTags", [ this.ignoreMetaTags ]);
},
clearHistory: function() {
this.callBrowserAdapter("clearHistory");
},
cutHandler: function() {
this.callBrowserAdapter("cut");
},
copyHandler: function() {
this.callBrowserAdapter("copy");
},
pasteHandler: function() {
this.callBrowserAdapter("paste");
},
selectAllHandler: function() {
this.callBrowserAdapter("selectAll");
},
callBrowserAdapter: function(e, t) {
if (this.adapterReady() && this._serverConnected) {
for (var n = 0, r; r = this.callQueue[n]; n++) this._callBrowserAdapter(r.name, r.args);
this.callQueue = [], this._callBrowserAdapter(e, t);
} else e !== "disconnectBrowserServer" && (this.callQueue.push({
name: e,
args: t
}), this.adapterReady() && !this._serverConnected && this.connect());
},
_callBrowserAdapter: function(e, t) {
this.node[e] && this.node[e].apply(this.node, t);
},
showFlashLockedMessage: function() {
this.flashPopup == null && (this.flashPopup = this.createComponent({
kind: "Popup",
modal: !0,
style: "text-align:center",
components: [ {
content: $L("Tap outside or pinch when finished")
} ]
}), this.flashPopup.render(), this.flashPopup.hasNode() && (this.flashTransitionEndHandler = enyo.bind(this, "flashPopupTransitionEndHandler"), this.flashPopup.node.addEventListener("webkitTransitionEnd", this.flashTransitionEndHandler, !1))), this.flashPopup.applyStyle("opacity", 1), this.flashPopup.openAtCenter(), enyo.job(this.id + "-hideFlashPopup", enyo.bind(this, "hideFlashLockedMessage"), 2e3);
},
hideFlashLockedMessage: function() {
this.flashPopup.addClass("enyo-webview-flashpopup-animate"), this.flashPopup.applyStyle("opacity", 0);
},
flashPopupTransitionEndHandler: function() {
this.flashPopup.removeClass("enyo-webview-flashpopup-animate"), this.flashPopup.close();
},
urlTitleChanged: function(e, t, n, r) {
this.lastUrl = this.url, this.url = e, this.doPageTitleChanged({
inTitle: t,
inUrl: e,
inCanGoBack: n,
inCanGoForward: r
});
},
loadStarted: function() {
this.doLoadStarted();
},
loadProgressChanged: function(e) {
this.doLoadProgress({
inProgress: e
});
},
loadStopped: function() {
this.log(), this.doLoadStopped();
},
documentLoadFinished: function() {
this.doLoadComplete();
},
mainDocumentLoadFailed: function(e, t, n, r) {
this.doError({
errorCode: t,
message: r + ": " + n
});
},
linkClicked: function(e) {},
urlRedirected: function(e, t) {
this.doUrlRedirected({
inUrl: e,
inCookie: t
});
},
updateGlobalHistory: function(e, t) {},
firstPaintCompleted: function() {},
editorFocused: function(e, t, n) {
window.PalmSystem && (e && this.node.focus(), window.PalmSystem.editorFocused(e, t, n)), this.doEditorFocusChanged({
inFocused: e,
inFieldType: t,
inFieldActions: n
});
},
scrolledTo: function(e, t) {
this.doScrolledTo({
x: e,
y: t
});
},
dialogAlert: function(e) {
this.doAlertDialog({
message: e
});
},
dialogConfirm: function(e) {
this.doConfirmDialog({
message: e
});
},
dialogPrompt: function(e, t) {
this.doPromptDialog({
message: e,
defaultValue: t
});
},
dialogSSLConfirm: function(e, t, n) {
this.doSSLConfirmDialog({
host: e,
code: t,
certFile: n
});
},
dialogUserPassword: function(e) {
this.doUserPasswordDialog({
message: e
});
},
mimeNotSupported: function(e, t) {
this.doFileLoad({
mimeType: e,
url: t
});
},
mimeHandoffUrl: function(e, t) {
this.doFileLoad({
mimeType: e,
url: t
});
},
mouseInInteractiveChange: function(e) {
this._mouseInInteractive = e;
},
mouseInFlashChange: function(e) {
this._mouseInFlash = e;
},
flashGestureLockChange: function(e) {
this._flashGestureLock = e, this._flashGestureLock && this.showFlashLockedMessage();
},
createPage: function(e) {
this.doNewPage(e);
},
scrollTo: function(e, t) {},
metaViewportSet: function(e, t, n, r, i, s) {},
browserServerDisconnected: function() {
this._serverConnected = !1, this.doDisconnected();
},
showPrintDialog: function() {
this.doPrint();
},
textCaretRectUpdate: function(e, t, n, r) {},
eventFired: function(e, t) {
var n = {
type: e.type,
pageX: e.pageX,
pageY: e.pageY
}, r = {
isNull: t.isNull,
isLink: t.isLink,
isImage: t.isImage,
x: t.x,
y: t.y,
bounds: {
left: t.bounds && t.bounds.left || 0,
top: t.bounds && t.bounds.top || 0,
right: t.bounds && t.bounds.right || 0,
bottom: t.bounds && t.bounds.bottom || 0
},
element: t.element,
title: t.title,
linkText: t.linkText,
linkUrl: t.linkUrl,
linkTitle: t.linkTitle,
altText: t.altText,
imageUrl: t.imageUrl,
editable: t.editable,
selected: t.selected
}, i = "do" + e.type.substr(0, 1).toUpperCase() + e.type.substr(1);
return this[i] && this[i].apply(this, {
event: n,
extra: r
});
},
showPopupMenu: function(e, t) {
this.doOpenSelect({
id: e,
items: t
});
},
didFinishDocumentLoad: function() {
this.documentLoadFinished();
},
failedLoad: function(e, t, n, r) {},
setMainDocumentError: function(e, t, n, r) {
this.mainDocumentLoadFailed(e, t, n, r);
},
firstPaintComplete: function() {
this.firstPaintCompleted();
},
loadProgress: function(e) {
this.loadProgressChanged(e);
},
pageDimensions: function(e, t) {},
smartZoomCalculateResponseSimple: function(e, t, n, r, i, s, o) {},
titleURLChange: function(e, t, n, r) {
this.urlTitleChanged(t, e, n, r);
}
}), enyo.kind({
name: "enyo.WebView",
kind: enyo.Control,
published: {
identifier: "",
url: "",
minFontSize: 16,
enableJavascript: !0,
blockPopups: !0,
acceptCookies: !0,
headerHeight: 0,
redirects: [],
networkInterface: "",
dnsServers: [],
ignoreMetaTags: !1,
cacheAdapter: !0
},
events: {
onMousehold: "",
onResized: "",
onPageTitleChanged: "",
onUrlRedirected: "",
onSingleTap: "",
onLoadStarted: "",
onLoadProgress: "",
onLoadStopped: "",
onLoadComplete: "",
onFileLoad: "",
onAlertDialog: "",
onConfirmDialog: "",
onPromptDialog: "",
onSSLConfirmDialog: "",
onUserPasswordDialog: "",
onNewPage: "",
onPrint: "",
onEditorFocusChanged: "",
onScrolledTo: "",
onError: "",
onDisconnected: ""
},
components: [ {
name: "view",
kind: enyo.BasicWebView,
onclick: "webviewClick",
onMousehold: "doMousehold",
onResized: "doResized",
onPageTitleChanged: "pageTitleChanged",
onUrlRedirected: "doUrlRedirected",
onSingleTap: "doSingleTap",
onLoadStarted: "doLoadStarted",
onLoadProgress: "doLoadProgress",
onLoadStopped: "doLoadStopped",
onLoadComplete: "doLoadComplete",
onFileLoad: "doFileLoad",
onAlertDialog: "alertDialog",
onConfirmDialog: "confirmDialog",
onPromptDialog: "promptDialog",
onSSLConfirmDialog: "sslConfirmDialog",
onUserPasswordDialog: "userPasswordDialog",
onOpenSelect: "showSelect",
onNewPage: "doNewPage",
onPrint: "doPrint",
onEditorFocusChanged: "doEditorFocusChanged",
onScrolledTo: "doScrolledTo",
onConnected: "connected",
onDisconnected: "disconnected",
onError: "doError",
cacheAdapter: !0
} ],
_freeSelectPopups: [],
_cachedSelectPopups: {},
create: function(e) {
this.inherited(arguments), this.identifierChanged(), this.minFontSizeChanged(), this.enableJavascriptChanged(), this.blockPopupsChanged(), this.acceptCookiesChanged(), this.headerHeightChanged(), this.addSystemRedirects(), this.redirectsChanged(), this.networkInterfaceChanged(), this.ignoreMetaTagsChanged(), this.urlChanged();
},
identifierChanged: function() {
this.$.view.setIdentifier(this.identifier);
},
urlChanged: function(e) {
this.$.view.setUrl(this.url);
},
minFontSizeChanged: function() {
this.$.view.setMinFontSize(this.minFontSize);
},
enableJavascriptChanged: function() {
this.$.view.setEnableJavascript(this.enableJavascript);
},
blockPopupsChanged: function() {
this.$.view.setBlockPopups(this.blockPopups);
},
acceptCookiesChanged: function() {
this.$.view.setAcceptCookies(this.acceptCookies);
},
headerHeightChanged: function() {
this.$.view.setHeaderHeight(this.headerHeight);
},
redirectsChanged: function(e) {
this.$.view.setRedirects(this.redirects);
},
networkInterfaceChanged: function() {
this.$.view.setNetworkInterface(this.networkInterface);
},
dnsServersChanged: function() {
this.$.view.setDnsServers(this.dnsServers);
},
ignoreMetaTagsChanged: function() {
this.$.view.setIgnoreMetaTags(this.ignoreMetaTags);
},
showSelect: function(e, t, n) {
this._cachedSelectPopups[t] ? (this._cachedSelectPopups[t]._response = -1, this.openSelect(this._cachedSelectPopups[t])) : enyo.asyncMethod(this, "createSelectPopup", t, n);
},
openSelect: function(e) {
var t = this._selectRect;
if (t) {
var n = e.calcSize(), r = this.getOffset(), i = Math.max(0, t.right - (t.right - t.left) / 2 - n.width / 2), s = Math.max(0, t.bottom - (t.bottom - t.top) / 2 - n.height / 2);
e.openAt({
left: i + r.left,
top: s + r.top
});
} else e.openAtCenter();
},
createSelectPopup: function(e, t) {
var n = this._freeSelectPopups.pop();
n ? (n._webviewId = e, n._response = -1) : n = this.createComponent({
kind: "PopupList",
name: "select-" + e,
_webviewId: e,
_response: -1,
onSelect: "selectPopupSelect",
onClose: "selectPopupClose"
});
var r = [], i = enyo.json.parse(t);
for (var s = 0, o; o = i.items[s]; s++) r.push({
caption: o.text,
disabled: !o.isEnabled
});
n.setItems(r), n.render(), this._cachedSelectPopups[e] = n, this.openSelect(n);
},
selectPopupSelect: function(e, t, n) {
e._response = t;
},
selectPopupClose: function(e) {
enyo.asyncMethod(this, "selectPopupReply", e);
},
selectPopupReply: function(e) {
this.callBrowserAdapter("selectPopupMenuItem", [ e._webviewId, e._response ]);
},
connected: function() {},
disconnected: function() {
var e = this._requestDisconnect;
this._requestDisconnect ? this._requestDisconnect = !1 : setTimeout(enyo.bind(this, "reinitialize"), 5e3), this.doDisconnected(e);
},
reinitialize: function() {
this.$.view.connect();
},
showSpinner: function() {},
hideSpinner: function() {},
pageTitleChanged: function(e, t) {
for (var n in this._cachedSelectPopups) this._freeSelectPopups.push(this._cachedSelectPopups[n]);
this._cachedSelectPopups = {}, this.doPageTitleChanged(t);
},
alertDialog: function() {
this.handleDialog("AlertDialog", arguments);
},
confirmDialog: function() {
this.handleDialog("ConfirmDialog", arguments);
},
promptDialog: function() {
this.handleDialog("PromptDialog", arguments);
},
sslConfirmDialog: function() {
this.handleDialog("SSLConfirmDialog", arguments);
},
userPasswordDialog: function() {
this.handleDialog("UserPasswordDialog", arguments);
},
handleDialog: function(e, t) {
var n = this["on" + e];
if (this.owner && this.owner[n]) {
var r = Array.prototype.slice.call(t, 1);
this["do" + e].apply(this, r);
} else this.cancelDialog();
},
activate: function() {
this.$.view.callBrowserAdapter("pageFocused", [ !0 ]);
},
deactivate: function() {
this.$.view.callBrowserAdapter("pageFocused", [ !1 ]);
},
deferSetUrl: function(e) {
this.setUrl(e);
},
resize: function() {},
resizeHandler: function() {
this.$.view.resize();
},
disconnect: function() {
this.$.view.callBrowserAdapter("disconnectBrowserServer"), this._requestDisconnect = !0;
},
clearCache: function() {
this.$.view.callBrowserAdapter("clearCache");
},
clearCookies: function() {
this.$.view.callBrowserAdapter("clearCookies");
},
clearHistory: function() {
this.$.view.clearHistory();
},
deleteImage: function(e) {
this.$.view.callBrowserAdapter("deleteImage", [ e ]);
},
generateIconFromFile: function(e, t, n, r, i, s) {
this.$.view.callBrowserAdapter("generateIconFromFile", [ e, t, n, r, i, s ]);
},
goBack: function() {
this.$.view.callBrowserAdapter("goBack");
},
goForward: function() {
this.$.view.callBrowserAdapter("goForward");
},
reloadPage: function() {
this.$.view.callBrowserAdapter("reloadPage");
},
resizeImage: function(e, t, n, r) {
this.$.view.callBrowserAdapter("resizeImage", [ e, t, n, r ]);
},
saveViewToFile: function(e, t, n, r, i) {
this.$.view.callBrowserAdapter("saveViewToFile", [ e, t, n, r, i ]);
},
stopLoad: function() {
this.$.view.callBrowserAdapter("stopLoad");
},
acceptDialog: function() {
var e = [].slice.call(arguments);
e.unshift("1"), this.$.view.callBrowserAdapter("sendDialogResponse", e);
},
cancelDialog: function() {
this.$.view.callBrowserAdapter("sendDialogResponse", [ "0" ]);
},
sendDialogResponse: function(e) {
this.$.view.callBrowserAdapter("sendDialogResponse", [ e ]);
},
inspectUrlAtPoint: function(e, t, n) {
this.$.view.callBrowserAdapter("inspectUrlAtPoint", [ e, t, n ]);
},
insertStringAtCursor: function(e) {
this.$.view.callBrowserAdapter("insertStringAtCursor", [ e ]);
},
saveImageAtPoint: function(e, t, n, r) {
this.$.view.callBrowserAdapter("saveImageAtPoint", [ e, t, n, r ]);
},
getImageInfoAtPoint: function(e, t, n) {
this.$.view.callBrowserAdapter("getImageInfoAtPoint", [ e, t, n ]);
},
setHTML: function(e, t) {
this.$.view.callBrowserAdapter("setHTML", [ e, t ]);
},
printFrame: function(e, t, n, r, i, s, o) {
this.$.view.callBrowserAdapter("printFrame", [ e, t, n, r, i, s, o ]);
},
findInPage: function(e) {
this.$.view.callBrowserAdapter("findInPage", [ e ]);
},
getHistoryState: function(e) {
this.$.view.getHistoryState(e);
},
redirectUrl: function(e, t, n) {
this.$.view.callBrowserAdapter("addUrlRedirect", [ e, n, t, 0 ]);
},
addSystemRedirects: function() {},
gotSystemRedirects: function(e, t) {
var n = t && enyo.json.parse(t.responseText), r = [];
for (var i = 0, s; n && n.redirects && (s = n.redirects[i]); i++) s.appId != enyo.fetchAppId() && r.push({
regex: s.url,
enable: !0,
cookie: s.appId,
type: 0
});
for (i = 0, s; n && n.commands && (s = n.commands[i]); i++) s.appId != enyo.fetchAppId() && s.appId != "com.palm.app.browser" && r.push({
regex: s.url,
enable: !0,
cookie: s.appId,
type: 1
});
this.$.view.setSystemRedirects(r);
},
callBrowserAdapter: function(e, t) {
this.$.view.callBrowserAdapter(e, t);
},
webviewClick: function(e, t) {
var n = t.extra;
n && (n.element == "SELECT" ? this._selectRect = n.bounds : this._selectRect = null, this.doClick(t.event));
}
});

// CoreNavi.js

enyo.kind({
name: "CoreNavi",
style: "background-color: black;",
layoutKind: "FittableColumnsLayout",
fingerTracking: !1,
components: [ {
style: "width: 33%;"
}, {
kind: "Image",
src: "$lib/webos-lib/assets/lightbar.png",
fit: !0,
style: "width: 33%; height: 24px; padding-top: 2px;",
ondragstart: "handleDragStart",
ondrag: "handleDrag",
ondragfinish: "handleDragFinish"
}, {
style: "width: 33%;"
} ],
create: function() {
this.inherited(arguments), window.PalmSystem && this.addStyles("display: none;");
},
handleDragStart: function(e, t) {
this.fingerTracking == 0 ? t.xDirection == -1 && (evB = document.createEvent("HTMLEvents"), evB.initEvent("keyup", "true", "true"), evB.keyIdentifier = "U+1200001", document.dispatchEvent(evB)) : enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDragStart", t);
},
handleDrag: function(e, t) {
this.fingerTracking == 1 && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDrag", t);
},
handleDragFinish: function(e, t) {
this.fingerTracking == 1 && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDragFinish", t);
}
});

// CoreNaviArranger.js

enyo.kind({
name: "enyo.CoreNaviArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width * .5;
},
destroy: function() {
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) this.pushPopControl(n, 0, 1), n.setShowing(!0), n.resized();
this.inherited(arguments);
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) {
s = n == 0 ? 1 : 0;
switch (n) {
case 0:
i = 1;
break;
case 1:
i = .66;
break;
case e.length - 1:
i = 1.33;
}
this.arrangeControl(r, {
scale: i,
opacity: s
});
}
},
start: function() {
this.inherited(arguments);
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && n.resized();
this.vendor || (this.vendor = this.getVendor());
},
finish: function() {
this.inherited(arguments);
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.scale, r = t.opacity;
n != null && r != null && this.pushPopControl(e, n, r);
},
pushPopControl: function(e, t, n) {
var r = t, i = n;
enyo.dom.canAccelerate ? e.applyStyle(this.vendor + "transform", "scale3d(" + r + "," + r + ",1)") : e.applyStyle(this.vendor + "transform", "scale(" + r + "," + r + ")"), enyo.Arranger.opacifyControl(e, n);
},
getVendor: function() {
var e = "", t = [ "transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform" ], n = document.createElement("div");
for (i = 0; i < t.length; i++) {
if (typeof n.style[t[i]] != "undefined") {
e = t[i];
break;
}
e = null;
}
switch (e) {
case "transform":
e = "";
break;
case "WebkitTransform":
e = "-webkit-";
break;
case "MozTransform":
e = "-moz-";
break;
case "OTransform":
e = "-o-";
break;
case "msTransform":
e = "-ms-";
}
return e;
}
});

// PortsHeader.js

enyo.kind({
name: "PortsHeader",
kind: "onyx.Toolbar",
classes: "ports-header",
title: "WebOS Ports Header",
taglines: [ "Random Tagline Here." ],
components: [ {
kind: "Image",
src: "icon.png",
style: "height: 100%; margin: 0;"
}, {
tag: "div",
style: "height: 100%; margin: 0 0 0 8px;",
components: [ {
name: "Title",
content: "",
style: "vertical-align: top; margin: 0; font-size: 21px;"
}, {
name: "Tagline",
content: "",
style: "display: block; margin: 0; font-size: 13px;"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.Title.setContent(this.title), this.$.Tagline.setContent(this.taglines[Math.floor(Math.random() * this.taglines.length)]);
}
});

// PortsSearch.js

enyo.kind({
name: "PortsSearch",
kind: "PortsHeader",
title: "WebOS Ports Search",
taglines: [ "Shiny search button, PRESS IT!" ],
events: {
onSearch: ""
},
components: [ {
name: "SearchAnimator",
kind: "Animator",
onStep: "animatorStep",
onStop: "animatorStop"
}, {
name: "Icon",
kind: "Image",
src: "icon.png",
style: "height: 100%; margin: 0;"
}, {
name: "TextDiv",
tag: "div",
style: "height: 100%; margin: 0;",
components: [ {
name: "Title",
content: "",
style: "vertical-align: top; margin: 0; font-size: 21px;"
}, {
name: "Tagline",
content: "",
style: "display: block; margin: 0; font-size: 13px;"
} ]
}, {
name: "SearchDecorator",
kind: "onyx.InputDecorator",
style: "position: absolute; top: 10px; right: 8px; width: 32px; padding: 2px 4px 3px 3px; max-width: 100%; float: right",
components: [ {
name: "SearchInput",
id: "searchBox",
kind: "onyx.Input",
selectOnFocus: !1,
style: "width: 0;",
oninput: "inputChanged",
onblur: "closeSearch"
}, {
kind: "Image",
src: "$lib/webos-lib/assets/search-input-search.png",
style: "width: 24px; height: 24px;",
onmousedown: "openSearch"
} ]
} ],
openSearch: function(e, t) {
this.$.SearchAnimator.setStartValue(0), this.$.SearchAnimator.setEndValue(1), this.$.SearchAnimator.play();
},
closeSearch: function(e, t) {
this.$.SearchInput.selectOnFocus = !0, this.$.SearchAnimator.setStartValue(1), this.$.SearchAnimator.setEndValue(0), this.$.SearchAnimator.play();
},
animatorStep: function(e, t) {
if (1 - e.value < 25e-5) return;
this.$.SearchInput.applyStyle("width", this.hasNode().offsetWidth * e.value - 52 + "px"), this.$.SearchDecorator.applyStyle("width", this.$.SearchInput.hasNode().offsetWidth + 32 + "px"), this.$.Icon.applyStyle("opacity", 1 - e.value), this.$.TextDiv.applyStyle("opacity", 1 - e.value), this.$.SearchAnimator.getStartValue() == 0 && this.$.SearchInput.focus();
},
animatorStop: function(e, t) {},
inputChanged: function(e, t) {
this.doSearch({
value: this.$.SearchInput.getValue()
});
},
searchActive: function() {
return this.$.SearchInput.getValue() != "";
}
});

// App.js

enyo.kind({
name: "App",
layoutKind: "FittableRowsLayout",
components: [ {
kind: "Signals",
ondeviceready: "deviceready",
onbackbutton: "handleBackGesture",
onCoreNaviDragStart: "handleCoreNaviDragStart",
onCoreNaviDrag: "handleCoreNaviDrag",
onCoreNaviDragFinish: "handleCoreNaviDragFinish"
}, {
kind: "FittableRows",
style: "border: 5px solid #333; background-color: #777; padding: 10px; color: white; margin: 10px; border-radius: 16px; text-align: right;",
fit: !0,
components: [ {
kind: "onyx.Toolbar",
style: "margin-bottom: 5px;",
components: [ {
name: "Result",
style: "font-size: 16pt; font-weight: bold;"
} ]
}, {
kind: "FittableColumns",
style: "margin-bottom: 5px;",
components: [ {
kind: "onyx.Toolbar",
style: "width: 75%; height: 48px; margin-left: 12.5%; margin-right: 5px; text-align: right;",
fit: !0,
components: [ {
name: "Formula",
style: "font-size: 12pt;"
} ]
}, {
kind: "onyx.Button",
style: "width: 48px; height: 48px; border-radius: 24px;",
classes: "onyx-toolbar",
content: "<",
ontap: "backspaceTapped"
} ]
}, {
kind: "FittableRows",
fit: !0,
defaultKind: enyo.kind({
kind: "FittableColumns",
style: "height: 15.5%; margin: 0.5%;",
defaultKind: enyo.kind({
kind: "onyx.Button",
classes: "onyx-toolbar",
style: "width: 24%; margin: 0.5%; border-radius: 8px; font-size: 24pt; font-weight: bold;",
ontap: "keyTapped"
})
}),
components: [ {
components: [ {
content: "Square Root",
ontap: "sqrtTapped"
}, {
content: "("
}, {
content: ")"
}, {
content: "C",
style: "margin-right: 0;",
ontap: "cancelTapped"
} ]
}, {
components: [ {
content: "ln",
ontap: "lnTapped"
}, {
content: "log",
ontap: "logTapped"
}, {
content: "^2"
}, {
content: ""
} ]
}, {
components: [ {
content: "7",
classes: "number-button"
}, {
content: "8",
classes: "number-button"
}, {
content: "9",
classes: "number-button"
}, {
content: "+",
style: "margin-right: 0;"
} ]
}, {
components: [ {
content: "4",
classes: "number-button"
}, {
content: "5",
classes: "number-button"
}, {
content: "6",
classes: "number-button"
}, {
content: "-",
style: "margin-right: 0;"
} ]
}, {
components: [ {
content: "1",
classes: "number-button"
}, {
content: "2",
classes: "number-button"
}, {
content: "3",
classes: "number-button"
}, {
content: "*",
style: "margin-right: 0;"
} ]
}, {
components: [ {
content: "."
}, {
content: "0",
classes: "number-button"
}, {
content: "=",
ontap: "equalsTapped"
}, {
content: "/",
style: "margin-right: 0;"
} ]
} ]
} ]
}, {
kind: "CoreNavi",
fingerTracking: !0
} ],
keyTapped: function(e, t) {
var n = this.$.Formula;
n.setContent(n.getContent() + e.getContent());
},
equalsTapped: function() {
this.$.Result.setContent(this.calculate(this.$.Formula.getContent()));
},
calculate: function(formula) {
try {
var parsed;
return parsed = formula.replace("sqrt", "Math.sqrt"), eval(parsed);
} catch (err) {
return enyo.log(err), "Invalid Input";
}
},
cancelTapped: function() {
this.$.Result.setContent(""), this.$.Formula.setContent("");
},
sqrtTapped: function() {
this.$.Result.setContent(""), this.$.Formula.setContent("sqrt(");
},
lnTapped: function() {
this.$.Result.setContent(""), this.$.Formula.setContent("ln(");
},
logTapped: function() {
this.$.Result.setContent(""), this.$.Formula.setContent("log(");
},
backspaceTapped: function() {
var e = this.$.Formula;
e.setContent(e.getContent().substr(0, e.getContent().length - 1));
},
handleBackGesture: function(e, t) {},
handleCoreNaviDragStart: function(e, t) {},
handleCoreNaviDrag: function(e, t) {},
handleCoreNaviDragFinish: function(e, t) {}
});
