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
    enteringY: false, // true implies also displaying it
    stack: [], // x, op pairs
    memory: "0",
    MAXDISPLAYLEN: 13,
    create: function() {
	this.inherited(arguments);
	this.display = this.y;
    },
    show: function(v) {
	if (v.length > this.MAXDISPLAYLEN) {
	    var pointix = v.indexOf(".");
	    if (pointix === -1 || pointix > this.MAXDISPLAYLEN) {
		// Just too long to display
		v = "Error";
	    } else if (pointix === this.MAXDISPLAYLEN ||
		       pointix === this.MAXDISPLAYLEN - 1) {
		v = Math.round(+v);
	    } else {
		var dp = this.MAXDISPLAYLEN - pointix - 1;
		// Unfortunately, toFixed() by itself is unpredictable
		v = v + 'e' + dp;
		v = Math.round(+v);
		v = v.toString().split('e');
		v = +(v[0] + 'e-' + dp);
		v = (+v).toFixed(dp).toString();
	    }
	}
	this.display = v.toString();
	/* Trim off trailing zeroes beyond the decimal point */
	pointix = this.display.indexOf(".");
	if (pointix !== -1) {
	    keepChecking = true;
	    while (keepChecking) {
		switch(this.display.charAt(this.display.length - 1)) {
		case '0':
		    this.display =
			this.display.substring(0, this.display.length - 1);
		    break
		case '.':
		    this.display =
			this.display.substring(0, this.display.length - 1);
		    keepChecking = false;
		    break;
		default:
		    keepChecking = false;
		    break;
		}
	    }
	}
	this.doDisplayChanged();
    },
    pressedKey: function(key) {
	switch (key) {
	case "clear":
	    this.y = "0";
	    this.enteringY = false;
	    this.stack = [];
	    this.show(this.y);
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
	    this.show(this.y);
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
		if (this.y !== "0" && this.y.length < this.MAXDISPLAYLEN) {
		    this.y += key;
		}
		break;
	    case "point":
		if (this.y.indexOf(".") === -1 && this.y.length < this.MAXDISPLAYLEN) {
		    this.y += ".";
		}
		break;
	    default:
		if (this.y === "0") {
		    this.y = key;
		} else if (this.y.length < this.MAXDISPLAYLEN) {
		    this.y += key;
		}
		break;
	    }
	    this.show(this.y);
	    break;
	case "backspace":
	    if (this.enteringY) {
		if (this.y.length > 1) {
		    this.y = this.y.substring(0, this.y.length - 1);
		} else {
		    this.y = "0";
		}
		this.show(this.y);
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
	    this.show(this.y);
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
	    this.show(this.y);
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
