/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
/*This is the actual calculator*/
enyo.kind({
    name: "StandardCalculator",
    kind: "enyo.Component",
    published: {
	display: "Error"
    },
    value: "0",
    arg: "0",
    enteringArg: false, // implies also displaying it
    op: "noOp",
    events: {
	onDisplayChanged:""
    },
    create: function() {
	this.inherited(arguments);
	this.display = this.value;
    },
    pressedKey: function(key) {
	switch (key) {
	case "0":
	case "1":
	case "2":
	case "3":
	case "4":
	case "5":
	case "6":
	case "7":
	case "8":
	case "9":
	case "point": {
	    this.enteringArg = true;
	    switch (key) {
	    case "0":
		if (this.arg !== "0") {
		    this.arg += key;
		}
		break;
	    case "point":
		if (this.arg.indexOf(".") === -1) {
		    this.arg += ".";
		}
		break;
	    default:
		if (this.arg === "0") {
		    this.arg = key;
		} else {
		    this.arg += key;
		}
		break;
	    }
	    this.display = this.arg;
	    this.doDisplayChanged();
	    break;
	}
	}
    }
});