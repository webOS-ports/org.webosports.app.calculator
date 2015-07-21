/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
	name: "App",
	palm: false,
	components: [
		{
			kind: "Signals",
			ondeviceready: "deviceready",
			onbackbutton: "handleBackGesture",
			onCoreNaviDragStart: "handleCoreNaviDragStart",
			onCoreNaviDrag: "handleCoreNaviDrag",
			onCoreNaviDragFinish: "handleCoreNaviDragFinish"
		},
		{
		    name: "calculatorHost",
		    kind: "enyo.Panels",
		    style: "height: 100%",
		    components: [
			{ name: "standardPanel", kind: "StandardEntry" },
			{ name: "formulaPanel", kind: "FormulaEntry" },
			{ name: "standardTestsPanel", kind: "StandardTests" }
		    ]
		},
		{
			name: "menu",
			kind: "AppMenu",
			components: [
			    { content: $L("Traditional Style"), ontap: "selectTraditional" },
			    { content: $L("Formula Style"), ontap: "selectFormulaEntry" },
			    { content: $L("Tests"), ontap: "selectTestsPanel",
			      name: "testsMenuEntry", showing: false },
			    { content: $L("About"), ontap: "aboutMe" }
			]
		},
		{
			name: "aboutPopup",
			kind: "About"
		},
		{name: "GetDevModeStatus", kind: "enyo.LunaService",
		 service: "luna://org.webosports.service.devmode/",
		 method: "getStatus", onComplete: "onGetDevModeStatusResponse"}
	],
	create: function() {
		this.inherited(arguments);
		if (window.PalmSystem) {
		    this.$.calculatorHost.setDraggable(false);
		}
		// Magic numbers, sorry.
		this.$.menu.setMaxHeight(34 * 3);
		var p = enyo.getCookie("likePanel");
		if (p) {
		    this.$.calculatorHost.selectPanelByName(p);
		}
		if (!window.PalmSystem) {
			enyo.log("Non-palm platform, service requests disabled.");
			return;
		}
		this.palm = true;
		this.$.GetDevModeStatus.send({});
	},
	selectTraditional: function() {
		this.$.calculatorHost.selectPanelByName("standardPanel");
		enyo.setCookie("likePanel", "standardPanel");
	},
	selectFormulaEntry: function() {
		this.$.calculatorHost.selectPanelByName("formulaPanel");
		enyo.setCookie("likePanel", "formulaPanel");
	},
	selectTestsPanel: function() {
		this.$.calculatorHost.selectPanelByName("standardTestsPanel");
	},
	aboutMe: function() {
		this.$.aboutPopup.show();
	},
	/* Service response handlers */
	onGetDevModeStatusResponse: function(inSender, inResponse) {
	    // Enable the Tests menu item if we are in developer mode
		if (inResponse.status === "enabled") {
		    this.$.menu.setMaxHeight(34 * 4);
		    this.$.testsMenuEntry.setShowing(true);
		}
	}
});
