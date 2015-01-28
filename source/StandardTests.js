/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
    name: "StandardTests",
    kind: "FittableRows",
    style: "-webkit-flex: 1; background-color: #777; padding: 5px; color: white; border-radius: 16px;",
    job: "",
    currentTest: 0,
    nTestsRun: 0,
    nTestsFailed: 0,
    components: [
	{ name: "calc", kind: "StandardCalculator", onDisplayChanged: "displayChanged" },
	{
	    kind: "onyx.Toolbar",
	    style: "margin-bottom: 5px;",
	    components: [
		{
		    name: "resultsSummary",
		    content: "Empty",
		    style: "font-size: 2em; font-weight: bold;"
		}]
	},
	{
	    name: "testRows", kind: "enyo.Scroller", fit: true, components: []
	}],
    create: function() {
	this.inherited(arguments);
	this.job = setInterval(enyo.bind(this, "timerExpired"), 200);
    },
    destroy: function() {
	clearInterval(this.job);
    },
    //Action Handlers
    timerExpired: function() {
	if (this.currentTest < this.tests.length) {
	    var i = this.currentTest;
	    this.currentTest = this.currentTest + 1;
	    // Run the test!
	    for (var j = 0; j < this.tests[i].keys.length; j = j + 1) {
		this.$.calc.pressedKey(this.tests[i].keys[j]);
	    }
	    var testOutput = this.$.calc.getDisplay();
	    var result = (testOutput === this.tests[i].expect);
	    this.nTestsRun += 1;
	    if (result) {
		var resultStyle = "background-color: green;";
	    } else {
		this.nTestsFailed += 1;
		var resultStyle = "background-color: red;";
	    }
	    this.$.resultsSummary.setContent("Fail " + this.nTestsFailed + " of " + this.nTestsRun);
	    this.$.testRows.createComponent( {
		kind: "onyx.Toolbar",
		classes: "test-record",
		components: [
		    { kind: "onyx.Button", style: resultStyle },
		    { content: this.tests[i].desc, style: "width: 155px;" },
		    { kind: "FittableRows", style: "min-width: 150px;", components: [
			{ content: "Expect: " + this.tests[i].expect },
			{ content: "Get: " + testOutput }
		    ] }
		] } );
	    this.$.testRows.render();
	} else {
	    enyo.log("Finished testing");
	    clearInterval(this.job);
	}
    },
    keyTapped: function(inSender) {
	this.$.calc.pressedKey(inSender.name);
    },
    //Calculator Event Handlers
    displayChanged: function(inSender, inEvent) {
	return true;
    },
    tests: [
	{ desc: "Initial state", keys: [], expect: "0" }, // Being the first test is very much implied!
	{ desc: "=", keys: ["equals"], expect: "0" },
	{ desc: "Clear", keys: ["clear"], expect: "0" },
	{ desc: "==", keys: ["equals", "equals"], expect: "0" },
	{ desc: "CC", keys: ["clear", "clear"], expect: "0" },
	{ desc: "0", keys: ["clear", "0"], expect: "0" },
	{ desc: "1", keys: ["clear", "1"], expect: "1" },
	{ desc: "1C", keys: ["clear", "1", "clear"], expect: "0" },
	// Clear probably works OK if we get this far
	{ desc: "0=", keys: ["clear", "0", "equals"], expect: "0" },
	{ desc: "00", keys: ["clear", "0", "0"], expect: "0" },
	{ desc: "1=", keys: ["clear", "1", "equals"], expect: "1" },
	{ desc: "11", keys: ["clear", "1", "1"], expect: "11" },
	{ desc: "0123456789.001", keys: ["clear", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "point", "0", "0", "1" ],
	  expect: "123456789.001" },
	{ desc: "0123456789.001=", keys: ["clear", "0", "1", "2", "3", "4", "5",
					  "6", "7", "8", "9", "point", "0", "0", "1", "equals"],
	  expect: "123456789.001" },
	{ desc: "1+", keys: ["clear", "1", "plus"], expect: "1" },
	{ desc: "1+1", keys: ["clear", "1", "plus", "1"], expect: "1" },
	{ desc: "1+=", keys: ["clear", "1", "plus", "equals"], expect: "2" },
	{ desc: "1+1=", keys: ["clear", "1", "plus", "1", "equals"], expect: "2" },
	{ desc: "1+2=", keys: ["clear", "1", "plus", "2", "equals"], expect: "3" },
	{ desc: "2+1=", keys: ["clear", "2", "plus", "1", "equals"], expect: "3" },
	{ desc: "2++1=", keys: ["clear", "2", "plus", "plus", "1", "equals"], expect: "3" },
	{ desc: "1+1+", keys: ["clear", "1", "plus", "1", "plus"], expect: "2" },
	{ desc: "1+1+1", keys: ["clear", "1", "plus", "1", "plus", "1"], expect: "1" },
	{ desc: "1+1+1=", keys: ["clear", "1", "plus", "1", "plus", "1", "equals"], expect: "3" },
	{ desc: "+1=", keys: ["clear", "plus", "1", "equals"], expect: "1" },
	{ desc: "1-", keys: ["clear", "1", "minus"], expect: "1" },
	{ desc: "1-1", keys: ["clear", "1", "minus", "1"], expect: "1" },
	{ desc: "1-=", keys: ["clear", "1", "minus", "equals"], expect: "0" },
	{ desc: "1-1=", keys: ["clear", "1", "minus", "1", "equals"], expect: "0" },
	{ desc: "1-2=", keys: ["clear", "1", "minus", "2", "equals"], expect: "-1" },
	{ desc: "2-1=", keys: ["clear", "2", "minus", "1", "equals"], expect: "1" },
	{ desc: "2--1=", keys: ["clear", "2", "minus", "minus", "1", "equals"], expect: "1" },
	{ desc: "1-1-", keys: ["clear", "1", "minus", "1", "minus"], expect: "0" },
	{ desc: "1-1-1", keys: ["clear", "1", "minus", "1", "minus", "1"], expect: "1" },
	{ desc: "1-1-1=", keys: ["clear", "1", "minus", "1", "minus", "1", "equals"], expect: "-1" },
	{ desc: "-1=", keys: ["clear", "minus", "1", "equals"], expect: "-1" },
	{ desc: "17-23-6+14=", keys: ["clear", "1", "7", "minus", "2", "3", "minus", "6", "plus",
				      "1", "4", "equals"], expect: "2" },
	{ desc: "9-+4=", keys: ["clear", "9", "minus", "plus", "4", "equals"], expect: "13" },
    ]
});
