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
			    { content: "Traditional Style", ontap: "selectTraditional" },
			    { content: "Formula Style", ontap: "selectFormulaEntry" },
			    { content: "Tests", ontap: "selectTestsPanel" },
			    { content: "About", ontap: "aboutMe"}
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
	},
	selectTraditional: function () {
		this.$.calculatorHost.selectPanelByName("standardPanel");
	},
	selectFormulaEntry: function () {
		this.$.calculatorHost.selectPanelByName("formulaPanel");
	},
	selectTestsPanel: function () {
		this.$.calculatorHost.selectPanelByName("standardTestsPanel");
	},
	aboutMe: function () {
		this.$.aboutPopup.show();
	}
});
