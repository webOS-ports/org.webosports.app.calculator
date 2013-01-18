enyo.kind({
	name: "App",
	layoutKind: "FittableRowsLayout",
	components: [
		{kind: "Signals",
		ondeviceready: "deviceready",
		onbackbutton: "handleBackGesture",
		onCoreNaviDragStart: "handleCoreNaviDragStart",
		onCoreNaviDrag: "handleCoreNaviDrag",
		onCoreNaviDragFinish: "handleCoreNaviDragFinish"},
		{kind: "FittableRows",
		style: "border: 5px solid #333; background-color: #777; padding: 10px; color: white; margin: 10px; border-radius: 16px; text-align: right;",
		fit: true,
		components:[
			{kind: "onyx.Toolbar", style: "margin-bottom: 5px;", components:[
				{name: "Result", style: "font-size: 16pt; font-weight: bold;"}
			]},
			{kind: "FittableColumns", style: "margin-bottom: 5px;", components:[
				{kind: "onyx.Toolbar",
					style: "width: 75%; height: 48px; margin-left: 12.5%; margin-right: 5px; text-align: right;",
				fit: true,
				components:[
					{name: "Formula", style: "font-size: 12pt;"}
				]},
				{kind: "onyx.Button", style: "width: 48px; height: 48px; border-radius: 24px;", classes: "onyx-toolbar", content: "<", ontap: "backspaceTapped"}
			]},
			{kind: "FittableRows",
			fit: true,
			defaultKind: enyo.kind({
				kind: "FittableColumns",
				style: "height: 19%; margin: 0.5%;",
				defaultKind: enyo.kind({
					kind: "onyx.Button",
					classes: "onyx-toolbar",
					style: "width: 24%; margin: 0.5%; border-radius: 8px; font-size: 24pt; font-weight: bold;",
					ontap: "keyTapped"
				}),
			}),
			components:[
				{components:[
					{style: "visibility: hidden;"},
					{content: "("},
					{content: ")"},
					{content: "C", style: "margin-right: 0;", ontap: "cancelTapped"},
				]},
				{components:[
					{content: "7", classes: "number-button"},
					{content: "8", classes: "number-button"},
					{content: "9", classes: "number-button"},
					{content: "+", style: "margin-right: 0;"},
				]},
				{components:[
					{content: "4", classes: "number-button"},
					{content: "5", classes: "number-button"},
					{content: "6", classes: "number-button"},
					{content: "-", style: "margin-right: 0;"},
				]},
				{components:[
					{content: "1", classes: "number-button"},
					{content: "2", classes: "number-button"},
					{content: "3", classes: "number-button"},
					{content: "*", style: "margin-right: 0;"},
				]},
				{components:[
					{content: "."},
					{content: "0", classes: "number-button"},
					{content: "=", ontap: "equalsTapped"},
					{content: "/", style: "margin-right: 0;"},
				]},
			]},
		]},
		{kind: "CoreNavi", fingerTracking: true}
	],
	//Action Handlers
	keyTapped: function(inSender, inEvent) {
		var formula = this.$.Formula;	
		formula.setContent(formula.getContent() + inSender.getContent());
	},
	equalsTapped: function() {
		try {
			var result = eval(this.$.Formula.getContent());
		}
		catch(err) {
			result = "Invalid Input";
		}
		this.$.Result.setContent(result);
	},
	cancelTapped: function() {
		this.$.Result.setContent("");
		this.$.Formula.setContent("");
	},
	backspaceTapped: function() {
		var formula = this.$.Formula;
		formula.setContent(formula.getContent().substr(0, formula.getContent().length - 1));
	},
	//Helper Functions
	handleBackGesture: function(inSender, inEvent) {
		//this.$.AppPanels.setIndex(0);
	},
	handleCoreNaviDragStart: function(inSender, inEvent) {
		/*
		if(enyo.Panels.isScreenNarrow()) {
			this.$.AppPanels.dragstartTransition(inEvent);
		}
		*/
	},
	handleCoreNaviDrag: function(inSender, inEvent) {
		/*
		if(enyo.Panels.isScreenNarrow()) {
			this.$.AppPanels.dragTransition(inEvent);
		}
		*/
	},
	handleCoreNaviDragFinish: function(inSender, inEvent) {
		/*
		if(enyo.Panels.isScreenNarrow()) {
			this.$.AppPanels.dragfinishTransition(inEvent);
		}
		*/
	},
});
