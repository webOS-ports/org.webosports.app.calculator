/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "StandardTests",
    kind: "FittableRows",
    style: "-webkit-flex: 1; background-color: #777; padding: 5px; color: white; border-radius: 16px;",
    job: "",
    components: [
	{ name: "calc", kind: "StandardCalculator", onDisplayChanged: "displayChanged" },
	{
	    kind: "onyx.Toolbar",
	    style: "margin-bottom: 5px;",
	    components: [
		{
		    name: "resultSummary",
		    content: "Empty",
		    style: "font-size: 2em; font-weight: bold;"
		}]
	},
	{
	    name: "testRows", kind: "enyo.Scroller", fit: true, components: []
	}],
    create: function() {
	this.inherited(arguments);
	this.job = setInterval(enyo.bind(this, "timerExpired"), 500);
    },
    destroy: function() {
	clearInterval(this.job);
    },
    //Action Handlers
    timerExpired: function() {
	this.$.testRows.createComponent({ content: "two" });
	this.$.testRows.render();
    },
    keyTapped: function(inSender) {
	this.$.calc.pressedKey(inSender.name);
    },
    //Calculator Event Handlers
    displayChanged: function(inSender, inEvent) {
	return true;
    }
});
