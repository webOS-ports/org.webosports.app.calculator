/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
	name: "App",
	style: "display: -webkit-flex; -webkit-flex-direction: column;  -webkit-justify-content: center",
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
			name: "tabletop",
			kind: "Control",
			style: "-webkit-flex: 1;   display: -webkit-flex; -webkit-flex-direction: row; -webkit-justify-content: center",
			components: [

				{
					kind: "Control",
					style: "-webkit-flex: 1; max-width: 550px;   display: -webkit-flex; -webkit-flex-direction: column;  -webkit-justify-content: center",
					components: [{
					    name: "calculatorHost",
					    kind: "Panels",
					    style: "-webkit-flex: 1; max-height: 665px; border: 5px solid #333; background-color: #777; padding: 10px; color: white; margin: 10px; border-radius: 16px; text-align: right;",
					    components: [
						{ name: "standardPanel", kind: "StandardEntry" },
						{ name: "formulaPanel", kind: "FormulaEntry" },
						{ name: "standardTestsPanel", kind: "StandardTests" }
					    ]
					}]
				}
			]
		}, // end tabletop
		{
			kind: "AppMenu",
			components: [
			    { content: "$L(Traditional Style)", ontap: "selectTraditional" },
			    { content: "$L(Formula Style)", ontap: "selectFormulaEntry" },
			    { content: "$L(Tests)", ontap: "selectTestsPanel" },
			    { content: "$L(About)", ontap: "aboutMe"}
			]
		},
		{
			name: "aboutPopup",
			kind: "About"
		}
	],
	create: function () {
		this.inherited(arguments);
		if (window.PalmSystem) {
		    this.$.calculatorHost.setDraggable(false);
		}
		var p = enyo.getCookie("likePanel");
		if (p) {
		    this.$.calculatorHost.selectPanelByName(p);
		}
	},
	selectTraditional: function () {
		this.$.calculatorHost.selectPanelByName("standardPanel");
		enyo.setCookie("likePanel", "standardPanel");
	},
	selectFormulaEntry: function () {
		this.$.calculatorHost.selectPanelByName("formulaPanel");
		enyo.setCookie("likePanel", "formulaPanel");
	},
	selectTestsPanel: function () {
		this.$.calculatorHost.selectPanelByName("standardTestsPanel");
	},
	aboutMe: function () {
		this.$.aboutPopup.show();
	}
});
