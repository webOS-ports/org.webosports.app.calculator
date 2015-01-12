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
					    kind: "FormulaEntry"
					}]
				}
			]
		}, // end tabletop
		{
			kind: "AppMenu",
			onSelect: "appMenuItemSelected",
			style: "border-radius: 16px;",
			components: [
			{
				content: "About",
				ontap: "aboutMe"
			}]
		},
		{
			name: "aboutPopup",
			kind: "About"
		}
	],
	create: function () {
		this.inherited(arguments);
	},
	aboutMe: function () {
		// todo add about stuff
		this.$.aboutPopup.show();
	}
});
