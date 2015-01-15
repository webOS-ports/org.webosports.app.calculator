/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "StandardEntry",
    kind: "FittableRows",
    style: "-webkit-flex: 1; background-color: #777; padding: 5px; color: white; border-radius: 16px;",
    components: [
	{
	    kind: "onyx.Toolbar",
	    style: "margin-bottom: 5px;",
	    components: [
		{
		    name: "Result",
		    style: "font-size: 1.2em; font-weight: bold;"
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
		    style: "width: 24%; margin-right: 1%; border-radius: 8px; font-size: 2em; font-weight: bold;",
		    ontap: "keyTapped",
		    allowHtml: true
		})
	    }),
	    components: [
		{
		    components: [
			{
			    content: "M+",
			},
			{
			    content: "MR"
			},
			{
			    content: "MC"
			},
			{
			    content: "&#247;"
			}
		    ]
		},
		{
		    components: [
			{
			    content: "7",
			    classes: "number-button"
			},
			{
			    content: "8",
			    classes: "number-button"
			},
			{
			    content: "9",
			    classes: "number-button"
			},
			{
			    content: "&#215;"
			}]
		},
		{
		    components: [
			{
			    content: "4",
			    classes: "number-button"
			},
			{
			    content: "5",
			    classes: "number-button"
			},
			{
			    content: "6",
			    classes: "number-button"
			},
			{
			    content: "&minus;"
			}]
		},
		{
		    components: [
			{
			    content: "1",
			    classes: "number-button"
			},
			{
			    content: "2",
			    classes: "number-button"
			},
			{
			    content: "3",
			    classes: "number-button"
			},
			{
			    content: "&plus;"
			}]
		},
		{
		    components: [
			{
			    content: "C",
			    classes: "cancel-button",
			    ontap: "cancelTapped"
			},
			{
			    content: "0",
			    classes: "number-button"
			},
			{
			    content: ".",
			    classes: "number-button"
			},
			{
			    content: "&equals;",
			    ontap: "equalsTapped"
			}]
		}

	    ]
	}],
    //Action Handlers
    keyTapped: function (inSender) {
    },
    equalsTapped: function () {
	this.$.Result.setContent("Equals Tapped");
    },
    cancelTapped: function () {
	this.$.Result.setContent("");
    },
    backspaceTapped: function () {
    }
});
