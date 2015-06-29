/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
/*This is the actual calculator*/
enyo.kind({
    name: "StandardCalculator",
    kind: "enyo.Component",
    published: {
	display: "Error",
	memoryActive: false
    },
    events: {
	onDisplayChanged:"",
	onMemoryActiveChanged:""
    },
    // result = x op y
    // We "enter y" when we hit number keys
    // We calculate and display a running total ("x") until we hit "equals"
    // If we select an operator with a higher precedence than the last one,
    // we push that last "x op" pair onto the stack
    y: "0",
    enteringY: false, // implies also displaying it
    stack: [], // x, op pairs
    memory: "0",
    create: function() {
	this.inherited(arguments);
	this.display = this.y;
    },
    pressedKey: function(key) {
	switch (key) {
	case "clear":
	    this.y = "0";
	    this.enteringY = false;
	    this.stack = [];
	    this.display = this.y;
	    this.doDisplayChanged();
	    break;
	case "memoryClear":
	    this.memory = "0";
	    this.memoryActive = false;
	    this.doMemoryActiveChanged();
	    break;
	case "memoryPlus":
	    this.enteringY = false;
	    this.memory = (+this.memory + +this.y).toString();
	    this.memoryActive = true;
	    this.doMemoryActiveChanged();
	    break;
	case "memoryRecall":
	    this.enteringY = false;
	    this.y = this.memory;
	    this.display = this.y;
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
	    if (this.enteringY === false) {
		this.y = "0";
	    }
	    this.enteringY = true;
	    switch (key) {
	    case "0":
		if (this.y !== "0" && this.y.length < 13) {
		    this.y += key;
		}
		break;
	    case "point":
		if (this.y.indexOf(".") === -1 && this.y.length < 13) {
		    this.y += ".";
		}
		break;
	    default:
		if (this.y === "0") {
		    this.y = key;
		} else if (this.y.length < 13) {
		    this.y += key;
		}
		break;
	    }
	    this.display = this.y;
	    this.doDisplayChanged();
	    break;
	case "backspace":
	    if (this.enteringY) {
		if (this.y.length > 1) {
		    this.y = this.y.substring(0, this.y.length - 1);
		} else {
		    this.y = "0";
		}
		this.display = this.y;
		this.doDisplayChanged();
	    }
	    break;
	case "plus":
	    this.beginNewOperation("add");
	    break;
	case "minus":
	    this.beginNewOperation("subtract");
	    break;
	case "multiply":
	    this.beginNewOperation("multiply");
	    break;
	case "divide":
	    this.beginNewOperation("divide");
	    break;
	case "equals":
	    this.enteringY = false;
	    this.calculate();
	    this.display = this.y;
	    this.doDisplayChanged();
	    break;
	}
    },
    calculate: function() {
	while (this.stack.length > 0) {
	    var obj = this.stack.shift();
	    switch (obj.op) {
	    case "add":
		this.y = (+obj.x + +this.y).toString();
		break;
	    case "subtract":
		this.y = (+obj.x - +this.y).toString();
		break;
	    case "multiply":
		this.y = (+obj.x * +this.y).toString();
		break;
	    case "divide":
		this.y = (+obj.x / +this.y).toString();
		break;
	    }
	}
    },
    beginNewOperation: function(newOp) {
	if (this.enteringY) {
	    this.enteringY = false;
	    switch (newOp) {
	    case "add":
	    case "subtract":
		this.calculate();
		this.stack.unshift({ x: this.y, op: newOp });
		break;
	    case "multiply":
	    case "divide":
		// These have greater precedence than addition and subtraction
		if (this.stack.length > 0) {
		    switch (this.stack[0].op) {
		    case "add":
		    case "subtract":
			// One special case (0-1/ should give -1 immediately)
			if (this.stack[0].x === "0") {
			    this.calculate();
			}
			break;
		    default:
			this.calculate();
			break;
		    }
		}
		this.stack.unshift({ x: this.y, op: newOp });
		break;
	    }
	    this.display = this.y;
	    this.doDisplayChanged();
	} else {
	    // We either have already begun an operation
	    // or we have not entered a number at all
	    if (this.stack.length > 0) {
		this.stack[0].op = newOp;
	    } else {
		this.stack.unshift({ x: this.y, op: newOp });
	    }
	}
    }
});
