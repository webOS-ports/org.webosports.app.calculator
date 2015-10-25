/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "StandardEntry",
    components: [
	{ name: "calc", kind: "StandardCalculator", onDisplayChanged: "displayChanged",
	  onMemoryActiveChanged: "memoryActiveChanged" },
	{
	    kind: "onyx.Toolbar",
	    components: [{ kind: "FittableRows", components: [
		{ kind: "FittableColumns", components: [
		    { name: "result", content: "Empty" },
		    { kind : "FittableRows", components: [
			{ name: "backspace", kind: "onyx.IconButton",
			  src: "assets/Calc-backspace.png",
			  ontap: "keyTapped" }]}
		]},
		{ name: "memoryIndicator", content: "" }
	    ]}]
	},
	{
	    name: "buttonContainer",
	    classes: "bezel",
	    defaultKind: enyo.kind({
		kind: "onyx.Button",
		classes: "function-button",
		ontap: "keyTapped",
		allowHtml: true
	    }),
	    components: [
			{
			    name: "memoryPlus",
			    content: "M+"
			},
			{
			    name: "memoryRecall",
			    content: "MR"
			},
			{
			    name: "memoryClear",
			    content: "MC"
			},
			{
			    name: "divide",
			    content: "&#247;"
			},
			{
			    name: "7",
			    content: "7",
			    classes: "number-button"
			},
			{
			    name: "8",
			    content: "8",
			    classes: "number-button"
			},
			{
			    name: "9",
			    content: "9",
			    classes: "number-button"
			},
			{
			    name: "multiply",
			    content: "&#215;"
			},
			{
			    name: "4",
			    content: "4",
			    classes: "number-button"
			},
			{
			    name: "5",
			    content: "5",
			    classes: "number-button"
			},
			{
			    name: "6",
			    content: "6",
			    classes: "number-button"
			},
			{
			    name: "minus",
			    content: "&minus;"
			},
			{
			    name: "1",
			    content: "1",
			    classes: "number-button"
			},
			{
			    name: "2",
			    content: "2",
			    classes: "number-button"
			},
			{
			    name: "3",
			    content: "3",
			    classes: "number-button"
			},
			{
			    name: "plus",
			    content: "&plus;"
			},
			{
			    name: "clear",
			    content: "C",
			    classes: "cancel-button"
			},
			{
			    name: "0",
			    content: "0",
			    classes: "number-button"
			},
			{
			    name: "point",
			    content: ".",
			    classes: "number-button"
			},
			{
			    name: "equals",
			    content: "&equals;"
			}
	    ]
	}],
    create: function() {
	this.inherited(arguments);
	this.$.result.setContent(this.$.calc.getDisplay());
    },
    reflow: function(inSender) {
	this.inherited(arguments);
    },
    //Action Handlers
    keyTapped: function(inSender) {
	this.$.calc.pressedKey(inSender.name);
    },
    //Calculator Event Handlers
    displayChanged: function(inSender, inEvent) {
	this.$.result.setContent(this.$.calc.getDisplay());
	return true;
    },
    memoryActiveChanged: function(inSender, inEvent) {
	if (this.$.calc.getMemoryActive()) {
	    this.$.memoryIndicator.setContent("M");
	} else {
	    this.$.memoryIndicator.setContent("");
	}
	return true;
    }
});
