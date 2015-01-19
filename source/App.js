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
					    name: "calculatorhost",
					    kind: "Panels",
//					    draggable: false,
					    style: "-webkit-flex: 1; max-height: 665px; border: 5px solid #333; background-color: #777; padding: 10px; color: white; margin: 10px; border-radius: 16px; text-align: right;",
					    components: [
						{ name: "standardpanel", kind: "StandardEntry" },
						{ name: "formulapanel", kind: "FormulaEntry" }
					    ]
					}]
				}
			]
		}, // end tabletop
		{
			kind: "AppMenu",
			onSelect: "appMenuItemSelected",
			style: "border-radius: 16px;",
			components: [
			    { content: "Traditional Style", ontap: "selectTraditional" },
			    { content: "Formula Style", ontap: "selectFormulaEntry" },
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
	},
    selectTraditional: function () {
	this.$.calculatorhost.selectPanelByName("standardpanel");
    },
    selectFormulaEntry: function () {
	this.$.calculatorhost.selectPanelByName("formulapanel");
    },
	aboutMe: function () {
		this.$.aboutPopup.show();
	}
});
