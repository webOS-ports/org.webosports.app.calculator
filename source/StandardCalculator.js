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
    op: "noOp", // add, subtract, multiply, divide
    events: {
	onDisplayChanged:""
    },
    create: function() {
	this.inherited(arguments);
	this.display = this.value;
    },
    pressedKey: function(key) {
	switch (key) {
	case "clear":
	    this.value = "0";
	    this.arg = "0";
	    this.enteringArg = false;
	    this.op = "noOp";
	    this.display = this.value;
	    this.doDisplayChanged();
	    break;
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
	case "point":
	    if (this.enteringArg === false) {
		this.arg = "0";
	    }
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
	case "plus":
	    this.enteringArg = false;
	    if (this.op !== "add") {
		this.op = "add";
		this.value = (+this.value + +this.arg).toString();
		this.display = this.value;
		this.doDisplayChanged();
	    }
	    break;
	case "equals":
	    this.enteringArg = false;
	    switch (this.op) {
	    case "noOp":
		this.value = this.arg;
		break;
	    case "add":
		this.value = (+this.value + +this.arg).toString();
		break;
	    }
	    this.display = this.value;
	    this.doDisplayChanged();
	    break;
	}
    }
});