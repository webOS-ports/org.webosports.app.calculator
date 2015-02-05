/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "FormulaEntry",
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
	    kind: "FittableColumns",
	    style: "margin-bottom: 5px;",
	    components: [
		{
		    kind: "onyx.Toolbar",
		    style: "width: 75%; height: 48px; margin-left: 12.5%; margin-right: 5px; text-align: right;",
		    fit: true,
		    components: [
			{
			    name: "Formula",
			    style: "font-size: 1em;"
			}]
		},
		{
		    kind: "onyx.Button",
		    style: "width: 48px; height: 48px; border-radius: 24px;",
		    classes: "onyx-toolbar",
		    content: "<",
		    ontap: "backspaceTapped"
		}]
	},
	{
	    kind: "FittableRows",
	    fit: true,
	    defaultKind: enyo.kind({
		kind: "FittableColumns",
		style: "height: 15.5%; margin: 0.5%;",
		defaultKind: enyo.kind({
		    kind: "onyx.Button",
		    classes: "onyx-toolbar",
		    style: "width: 24%; margin: 0.5%; border-radius: 8px; font-size: 2em; font-weight: bold;",
		    ontap: "keyTapped",
		    allowHtml: true
		})
	    }),
	    components: [
		{
		    components: [
			/**{style: "visibility: hidden;"},*/
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
			    content: "C",
			    style: "margin-right: 0;",
			    ontap: "cancelTapped"
			}
		    ]
		},
		{
		    components: [
			{
			    content: "ln",
			    value: "ln("
			},
			{
			    content: "log",
			    value: "log("
			},
			{
			    content: "x<sup>2</sup>",
			    value: "^2"
			},
			{
			    content: "^"
			}
			//{content: "%", ontap: "percentTapped"} // TODO: make room for more buttons and fix percentTapped, or remove it
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
			    content: "+",
			    style: "margin-right: 0;"
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
			    content: "-",
			    style: "margin-right: 0;"
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
			    content: "*",
			    style: "margin-right: 0;"
			}]
		},
		{
		    components: [
			{
			    content: "."
			},
			{
			    content: "0",
			    classes: "number-button"
			},
			{
			    content: "=",
			    ontap: "equalsTapped"
			},
			{
			    content: "/",
			    style: "margin-right: 0;"
			}]
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
