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
	{ name: "calc", kind: "StandardCalculator", onDisplayChanged: "displayChanged",
	  onMemoryActiveChanged: "memoryActiveChanged" },
	{
	    kind: "onyx.Toolbar",
	    style: "margin-bottom: 5px;",
	    components: [
		{ kind: onyx.Button, name: "theButton", content: "Start", ontap: "tapped" },
		{
		    name: "resultsSummary",
		    content: "",
		    style: "font-size: 2em; font-weight: bold;"
		}]
	},
	{
	    name: "testRows", kind: "enyo.Scroller", fit: true,
	    strategyKind: "TouchScrollStrategy", components: []
	}],
    create: function() {
	this.inherited(arguments);
    },
    destroy: function() {
	clearInterval(this.job);
    },
    tapped: function() {
	if (this.$.theButton.content === "Start") {
	    this.$.theButton.setContent("Stop");
	    this.job = setInterval(enyo.bind(this, "timerExpired"), 200);
	} else {
	    this.$.theButton.setContent("Start");
	    clearInterval(this.job);
	}
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
	    enyo.log("Finished testing. Fail " + this.nTestsFailed + " of " + this.nTestsRun);
	    clearInterval(this.job);
	    this.$.theButton.setContent($L("Done"));
	    this.$.theButton.setDisabled(true);
	}
    },
    keyTapped: function(inSender) {
	this.$.calc.pressedKey(inSender.name);
    },
    //Calculator Event Handlers
    displayChanged: function(inSender, inEvent) {
	return true;
    },
    memoryActiveChanged: function(inSender, inEvent) {
	return true;
    },
    tests: [
	{ desc: $L("Initial state"), keys: [], expect: "0" }, // Being the first test is very much implied!
	{ desc: "=", keys: ["equals"], expect: "0" },
	{ desc: $L("Clear"), keys: ["clear"], expect: "0" },
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
	{ desc: "0123456789..001", keys: ["clear", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "point", "point", "0", "0", "1" ],
	  expect: "123456789.001" },
	{ desc: "0123456789.001=", keys: ["clear", "0", "1", "2", "3", "4", "5",
					  "6", "7", "8", "9", "point", "0", "0", "1", "equals"],
	  expect: "123456789.001" },
	{ desc: "12<3", keys: ["clear", "1", "2", "backspace", "3"], expect: "13" },
	{ desc: "0<", keys: ["clear", "0", "backspace"], expect: "0" },
	{ desc: "1<", keys: ["clear", "1", "backspace"], expect: "0" },
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
	{ desc: "1*", keys: ["clear", "1", "multiply"], expect: "1" },
	{ desc: "1*1", keys: ["clear", "1", "multiply", "1"], expect: "1" },
	{ desc: "2*=", keys: ["clear", "2", "multiply", "equals"], expect: "4" },
	{ desc: "1*1=", keys: ["clear", "1", "multiply", "1", "equals"], expect: "1" },
	{ desc: "1*2=", keys: ["clear", "1", "multiply", "2", "equals"], expect: "2" },
	{ desc: "2*7=", keys: ["clear", "2", "multiply", "7", "equals"], expect: "14" },
	{ desc: "2**7=", keys: ["clear", "2", "multiply", "multiply", "7", "equals"], expect: "14" },
	{ desc: "3*2*", keys: ["clear", "3", "multiply", "2", "multiply"], expect: "6" },
	{ desc: "5*2*3", keys: ["clear", "5", "multiply", "2", "multiply", "3"], expect: "3" },
	{ desc: "5*2*3=", keys: ["clear", "5", "multiply", "2", "multiply", "3", "equals"], expect: "30" },
	{ desc: "*1=", keys: ["clear", "multiply", "1", "equals"], expect: "0" },
	// Only delete something you actually typed
	{ desc: "1*<", keys: ["clear", "1", "multiply", "backspace"], expect: "1" },
	{ desc: "5+2*", keys: ["clear", "5", "plus", "2", "multiply"], expect: "2" },
	{ desc: "5+2*3=", keys: ["clear", "5", "plus", "2", "multiply", "3", "equals"], expect: "11" },
	{ desc: "5*2+", keys: ["clear", "5", "multiply", "2", "plus"], expect: "10" },
	{ desc: "5*2+3=", keys: ["clear", "5", "multiply", "2", "plus", "3", "equals"], expect: "13" },
	{ desc: "5-2*", keys: ["clear", "5", "minus", "2", "multiply"], expect: "2" },
	{ desc: "5-2*3=", keys: ["clear", "5", "minus", "2", "multiply", "3", "equals"], expect: "-1" },
	{ desc: "5*2-", keys: ["clear", "5", "multiply", "2", "minus"], expect: "10" },
	{ desc: "5*2-3=", keys: ["clear", "5", "multiply", "2", "minus", "3", "equals"], expect: "7" },
	{ desc: "5*2-3*127=", keys: ["clear", "5", "multiply", "2", "minus", "3",
				     "multiply", "1", "2", "7", "equals"], expect: "-371" },
 	{ desc: "1/", keys: ["clear", "1", "divide"], expect: "1" },
	{ desc: "1/1", keys: ["clear", "1", "divide", "1"], expect: "1" },
	{ desc: "2/=", keys: ["clear", "2", "divide", "equals"], expect: "1" },
	{ desc: "1/1=", keys: ["clear", "1", "divide", "1", "equals"], expect: "1" },
	{ desc: "1/2=", keys: ["clear", "1", "divide", "2", "equals"], expect: "0.5" },
	{ desc: "2/16=", keys: ["clear", "2", "divide", "1", "6", "equals"], expect: "0.125" },
	{ desc: "8//2=", keys: ["clear", "8", "divide", "divide", "2", "equals"], expect: "4" },
	{ desc: "3/2/", keys: ["clear", "3", "divide", "2", "divide"], expect: "1.5" },
	{ desc: "9/2/3", keys: ["clear", "9", "divide", "2", "divide", "3"], expect: "3" },
	{ desc: "9/2/3=", keys: ["clear", "9", "divide", "2", "divide", "3", "equals"], expect: "1.5" },
	{ desc: "/1=", keys: ["clear", "divide", "1", "equals"], expect: "0" },
	{ desc: "5+4/", keys: ["clear", "5", "plus", "4", "divide"], expect: "4" },
	{ desc: "5+2/1=", keys: ["clear", "5", "plus", "2", "divide", "1", "equals"], expect: "7" },
	{ desc: "5/2+", keys: ["clear", "5", "divide", "2", "plus"], expect: "2.5" },
	{ desc: "5/2+3=", keys: ["clear", "5", "divide", "2", "plus", "3", "equals"], expect: "5.5" },
	{ desc: "9-8/", keys: ["clear", "9", "minus", "8", "divide"], expect: "8" },
	{ desc: "9-8/4=", keys: ["clear", "9", "minus", "8", "divide", "4", "equals"], expect: "7" },
	{ desc: "5/2-", keys: ["clear", "5", "divide", "2", "minus"], expect: "2.5" },
	{ desc: "12/2-126=", keys: ["clear", "1", "2", "divide", "2", "minus", "1", "2", "6", "equals"], expect: "-120" },
	{ desc: "12/2-126/3=", keys: ["clear", "1", "2", "divide", "2", "minus", "1", "2", "6",
				      "divide", "3", "equals"], expect: "-36" },
	{ desc: "1/0=", keys: ["clear", "1", "divide", "0", "equals"], expect: "Infinity" },
	{ desc: "-1/", keys: ["clear", "minus", "1", "divide"], expect: "-1" },
	{ desc: "0-1/", keys: ["clear", "0", "minus", "1", "divide"], expect: "-1" },
	{ desc: "-1/0=", keys: ["clear", "minus", "1", "divide", "0", "equals"], expect: "-Infinity" },
	{ desc: "1 MC 3", keys: ["clear", "1", "memoryClear", "3"], expect: "13" },
	{ desc: "1 M+ 3", keys: ["clear", "1", "memoryPlus", "3"], expect: "3" },
	{ desc: "9 MC MR", keys: ["clear", "9", "memoryClear", "memoryRecall"], expect: "0" },
	{ desc: "MC M+ MR", keys: ["clear", "memoryClear", "memoryPlus", "memoryRecall"], expect: "0" },
	{ desc: "MC 8 M+ MR", keys: ["clear", "memoryClear", "8", "memoryPlus", "memoryRecall"], expect: "8" },
	{ desc: "MC 8 M+ 1 MR", keys: ["clear", "memoryClear", "8", "memoryPlus", "1", "memoryRecall"], expect: "8" },
	{ desc: "MC 8 M+ 1 M+", keys: ["clear", "memoryClear", "8", "memoryPlus",
					 "1", "memoryPlus"], expect: "1" },
	{ desc: "MC 8 M+ 1 M+ MR", keys: ["clear", "memoryClear", "8", "memoryPlus",
					  "1", "memoryPlus", "memoryRecall"], expect: "9" },
	// Fundamental: http://ecma262-5.com/ELS5_HTML.htm#Section_8.5
	// With 2em font there's only room for 13 characters in the results display
	// (sign, digits, point)
	// Need to control how many the user can enter.
	// Need to prevent results overflow.
	// Also ought to round results to sensible precision in the more obvious cases.
	{ desc: ".0001*.0001=", keys: ["clear", "point", "0", "0", "0", "1", "multiply",
				    "point", "0", "0", "0", "1", "equals"], expect: "0.00000001" }
   ]
});
