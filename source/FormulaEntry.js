/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "FormulaEntry",
    components: [
	{
	    kind: "onyx.Toolbar",
	    components: [
		{
		    name: "Result"
		}]
	},
	{
	    kind: "onyx.Toolbar",
	    classes: "formula-bar",
	    components: [
		{name: "Formula"},
		{kind: "onyx.IconButton", src: "assets/Calc-backspace.png",
		 ontap: "backspaceTapped"}
	    ]
	},
	{
	    defaultKind: enyo.kind({
		kind: "onyx.Button",
		classes: "function-button-6rows",
		ontap: "keyTapped",
		allowHtml: true
	    }),
	    components: [
		{
		    content: "\u221a",
		    value: "sqrt("
		},
		{
		    content: "("
		},
		{
		    content: ")"
		},
		{
		    content: "^"
 		},
		{
		    content: "ln",
		    value: "ln("
		},
		{
		    content: "log",
		    value: "log("
		},
		{
		    content: "x&sup2;",
		    value: "^2"
		},
		{
		    content: "/"
		},
		{
		    content: "7",
		    classes: "number-button-6rows"
		},
		{
		    content: "8",
		    classes: "number-button-6rows"
		},
		{
		    content: "9",
		    classes: "number-button-6rows"
		},
		{
		    content: "*"
		},
		{
		    content: "4",
		    classes: "number-button-6rows"
		},
		{
		    content: "5",
		    classes: "number-button-6rows"
		},
		{
		    content: "6",
		    classes: "number-button-6rows"
		},
		{
		    content: "-"
		},
		{
		    content: "1",
		    classes: "number-button-6rows"
		},
		{
		    content: "2",
		    classes: "number-button-6rows"
		},
		{
		    content: "3",
		    classes: "number-button-6rows"
		},
		{
		    content: "+"
		},
		{
		    content: "C",
		    classes: "cancel-button-6rows",
		    ontap: "cancelTapped"
		},
		{
		    content: "0",
		    classes: "number-button-6rows"
		},
		{
		    content: ".",
		    classes: "number-button-6rows"
		},
		{
		    content: "=",
		    ontap: "equalsTapped"
		}
	    ]
	}],
    //Action Handlers
    keyTapped: function (inSender) {
	this.formulaAppend(inSender.value || inSender.getContent());
    },
    formulaAppend: function (str) {
	this.$.Formula.setContent(this.$.Formula.getContent() + str);
    },
    equalsTapped: function () {
	this.$.Result.setContent(this.calculate(this.$.Formula.getContent()));
    },
    calculate: function (formula) {
	try {
	    return Parser.evaluate(formula);
	}
	catch (err) {
	    enyo.log(err);
	    return "Invalid Input";
	}
    },
    cancelTapped: function () {
	this.$.Result.setContent("");
	this.$.Formula.setContent("");
    },
    backspaceTapped: function () {
	var formula = this.$.Formula;
	formula.setContent(formula.getContent().substr(0, formula.getContent().length - 1));
    }
});
