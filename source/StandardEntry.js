/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "StandardEntry",
    kind: "FittableRows",
    style: "-webkit-flex: 1; background-color: #777; padding: 5px; color: white; border-radius: 16px;",
    components: [
	{ name: "calc", kind: "StandardCalculator", onDisplayChanged: "displayChanged" },
	{
	    kind: "onyx.Toolbar",
	    style: "margin-bottom: 5px;",
	    components: [
		{
		    name: "result",
		    content: "Empty",
		    style: "font-size: 2em; font-weight: bold;"
		}]
	},
	{
	    kind: "FittableRows",
	    fit: true,
	    defaultKind: enyo.kind({
		kind: "FittableColumns",
		style: "height: 15%; margin-left: 0; margin-top: 5%;",
		defaultKind: enyo.kind({
		    kind: "onyx.Button",
		    classes: "function-button",
		    style: "width: 24%; margin-right: 1%; border-radius: 8px; font-size: 1.5em; font-weight: bold;",
		    ontap: "keyTapped",
		    allowHtml: true
		})
	    }),
	    components: [
		{
		    components: [
			{
			    name: "memoryPlus",
			    content: "M+",
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
			}
		    ]
		},
		{
		    components: [
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
			    content: "&#215;" // Multiply
			}]
		},
		{
		    components: [
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
			}]
		},
		{
		    components: [
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
			}]
		},
		{
		    components: [
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
			}]
		}
	    ]
	}],
    create: function() {
	this.inherited(arguments);
	this.$.result.setContent(this.$.calc.getDisplay());
    },
    //Action Handlers
    keyTapped: function(inSender) {
	this.$.calc.pressedKey(inSender.name);
    },
    //Calculator Event Handlers
    displayChanged: function(inSender, inEvent) {
	this.$.result.setContent(this.$.calc.getDisplay());
	return true;
    }
});
