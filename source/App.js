enyo.kind({
	name: "App",
	style: "display: -webkit-flex; -webkit-flex-direction: column;  -webkit-justify-content: center",
	components: [
		{kind: "Signals",
		ondeviceready: "deviceready",
		onbackbutton: "handleBackGesture",
		onCoreNaviDragStart: "handleCoreNaviDragStart",
		onCoreNaviDrag: "handleCoreNaviDrag",
		onCoreNaviDragFinish: "handleCoreNaviDragFinish"},
		{name: "tabletop", kind: "Control", style:"-webkit-flex: 1;   display: -webkit-flex; -webkit-flex-direction: row; -webkit-justify-content: center", components: [
		
			{kind: "Control", style: "-webkit-flex: 1; max-width: 550px;   display: -webkit-flex; -webkit-flex-direction: column;  -webkit-justify-content: center", components:[
				{name: "bezel", kind: "FittableRows",
				style: "-webkit-flex: 1; max-height: 665px; border: 5px solid #333; background-color: #777; padding: 10px; color: white; margin: 10px; border-radius: 16px; text-align: right;",
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
						style: "height: 15.5%; margin: 0.5%;",
						defaultKind: enyo.kind({
						kind: "onyx.Button",
						classes: "onyx-toolbar",
						style: "width: 24%; margin: 0.5%; border-radius: 8px; font-size: 24pt; font-weight: bold;",
						ontap: "keyTapped"
						})
					}),
					components:[
						{components:[
							/**{style: "visibility: hidden;"},*/
							{content: "\u221a", ontap: "sqrtTapped"},		
							{content: "("},
							{content: ")"},
							{content: "C", style: "margin-right: 0;", ontap: "cancelTapped"}
						]},
						{components:[
							{content: "ln", ontap: "lnTapped"},
							{content: "log", ontap: "logTapped"},
							{content: "^2"},
							{content: "%", ontap: "percentTapped"}
						]},
						{components:[
							{content: "7", classes: "number-button"},
							{content: "8", classes: "number-button"},
							{content: "9", classes: "number-button"},
							{content: "+", style: "margin-right: 0;"}
						]},
						{components:[
							{content: "4", classes: "number-button"},
							{content: "5", classes: "number-button"},
							{content: "6", classes: "number-button"},
							{content: "-", style: "margin-right: 0;"}
						]},
						{components:[
							{content: "1", classes: "number-button"},
							{content: "2", classes: "number-button"},
							{content: "3", classes: "number-button"},
							{content: "*", style: "margin-right: 0;"}
						]},
						{components:[
							{content: "."},
							{content: "0", classes: "number-button"},
							{content: "=", ontap: "equalsTapped"},
							{content: "/", style: "margin-right: 0;"}
						]}
					
					]}
				]}   // end bezel
			]}
		]},   // end tabletop
		{kind:"AppMenu",
		onSelect: "appMenuItemSelected",
		style: "border-radius: 16px;",
		components: [
			{content: "Simple Math", ontap: "simpleMath"},
			{content: "Advanced Math", ontap: "advancedMath"},
			{content: "About", ontap: "about"}
		]},
		{name: "aboutPopup", kind: "About"},
	],
	//Action Handlers
	keyTapped: function(inSender, inEvent) {
		var formula = this.$.Formula;
		formula.setContent(formula.getContent() + inSender.getContent());
		
	},
	equalsTapped: function() {
		this.$.Result.setContent(this.calculate(this.$.Formula.getContent()));
	},
	calculate: function(formula) {
		try {
			// Replace mathematical notation with JS here
			var parsed;
			parsed = formula.replace('sqrt', 'Math.sqrt');
			
			return eval(parsed);
		}
		catch(err) {
			enyo.log(err);
			return "Invalid Input";
		}
	},
	cancelTapped: function() {
		this.$.Result.setContent("");
		this.$.Formula.setContent("");
	},
	sqrtTapped: function() {
		this.$.Result.setContent("");
		this.$.Formula.setContent("sqrt(");
	},
	lnTapped: function() {
		this.$.Result.setContent("");
		this.$.Formula.setContent("ln(");
	},
	logTapped: function() {
		this.$.Result.setContent("");
		this.$.Formula.setContent("log(");
	},
	backspaceTapped: function() {
		var formula = this.$.Formula;
		formula.setContent(formula.getContent().substr(0, formula.getContent().length - 1));
	},
	percentTapped: function() {
		var string = this.$.Formula.getContent();
		this.$.Result.setContent("");

		if (string.length <= 1){
			string = ".0" + string;
			this.$.Formula.setContent(string);
		}else{
			var res = string.slice(0,string.length -2 );
			if(isNaN(string.substr(-2,2)) === true){
				var lastNum = string.substr(-1,1);
				this.$.Formula.setContent(string.slice(0,string.length -1 ) + ".0" + lastNum);
				return;
			}				// if last two digits are not NaN
			this.$.Formula.setContent(res + "." + string.substr(-2,2));
		}
		
	},
	advanceMath: function (inSender, inEvent){ 
		// to do advance math 
	},
	simpleMath: function (inSender, inEvent){ 
		// to do simple math 
	},
	about: function (inSender, inEvent){ 
		// todo add about stuff
		this.$.aboutPopup.show();
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
	}
});



enyo.kind({
	name: "About",
	kind: "onyx.Popup",
	modal: true,
	centered: true,
	floating: true,
	autoDismiss: false,
	classes:"classic-popup",
	published: {
	},
	events: {
		onError: ""
	},
	components: [
		{kind: "enyo.FittableRows", components:[
			{tag: "div", name: "title", classes:"title", content: "About"},
			{kind: "enyo.Scroller", classes: "small-popup", components: [
			{ name:"popupContent", fit: true,components:[
				{kind: "FittableRows", style: "height: 100%;", name: "aboutDescription", components: [
					{kind:"FittableColumns", components: [
						{content: "Version: ", classes: "about-description"},
						{content: "  ", style: "width: 20px;"},
						{name: "versionValue"},

					]},
					{kind:"FittableColumns", components: [				
						{content: "In case of issue, please consider", classes: "about-description"},
						{content: "  ", style: "width: 20px;"},
						{name: "brValue", kind: "enyo.Control", tag: "a", content: "Reporting a bug", attributes: {"target": "_blank"}}
					]},
					{kind:"FittableColumns", components: [				
						{content: "See", classes: "about-description"},
						{content: "  ", style: "width: 20px;"},
						{name: "homeValue", kind: "enyo.Control", tag: "a", content: "Project Homepage", attributes: {"target": "_blank"}}				
					]},
					{kind:"FittableColumns", style: "height: 100%;", components: [				
						{content: "License: ", classes: "about-description"},
						{content: "  ", style: "width: 20px;"},
						{name: "license",  style: "height: 100%;", classes: "about-description"},
					]}
				]}
			]}
		]},
			{kind: "onyx.Toolbar", classes:"bottom-bar", name: "buttons", components: [
				{name:"cancelButton", classes:"button", kind: "onyx.Button", content: "Close", ontap: "actionClose"}
			]},
		]}
	],
	
	/**
	 * @protected
	 */
	create: function(){
		this.inherited(arguments);
		this.aboutData();
	},
	
	/**
	 * @private
	 */
	aboutData: function(){
		this.$.versionValue.content = "\t" + "0.1.1";
		this.$.brValue.setAttribute("href", "http://issues.webos-ports.org/");
		this.$.homeValue.setAttribute("href", "https://github.com/webOS-ports/org.webosports.app.calculator");
		this.$.license.content = "	";
	},
	actionClose: function(inSender, inEvent) {
		this.hide();
		return true;
	},
});


