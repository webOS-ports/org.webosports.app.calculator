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
					    kind: "Panels",
					    style: "-webkit-flex: 1; max-height: 665px; border: 5px solid #333; background-color: #777; padding: 10px; color: white; margin: 10px; border-radius: 16px; text-align: right;",
					    components: [
						{ kind: "StandardEntry" },
						{ kind: "FormulaEntry" }
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
