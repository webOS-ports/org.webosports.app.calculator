/*jslint browser: true, debug: true, sloppy: true, stupid: true, todo: true, white: true */
/*global enyo, isNaN */
enyo.kind({
	name: "About",
	kind: "onyx.Popup",
	modal: true,
	centered: true,
	floating: true,
	autoDismiss: false,
	classes: "classic-popup",
	published: {},
	events: {
		onError: ""
	},
	components: [
	{
		kind: "enyo.FittableRows",
		components: [
		{
			tag: "div",
			name: "title",
			classes: "title",
			content: "About"
		},
		{
			kind: "enyo.Scroller",
			classes: "small-popup",
			components: [
			{
				name: "popupContent",
				fit: true,
				components: [
				{
					kind: "FittableRows",
					style: "height: 100%;",
					name: "aboutDescription",
					components: [
					{
						kind: "FittableColumns",
						components: [
							{
								content: "Version: ",
								classes: "about-description"
							},
							{
								content: "  ",
								style: "width: 20px;"
							},
							{
								name: "versionValue"
							}

						]
					},
					{
						kind: "FittableColumns",
						components: [
						{
							content: "In case of issue, please consider",
							classes: "about-description"
						},
						{
							content: "  ",
							style: "width: 20px;"
						},
						{
							name: "brValue",
							kind: "enyo.Control",
							tag: "a",
							content: "Reporting a bug",
							attributes: {
								"target": "_blank"
							}
						}]
					},
					{
						kind: "FittableColumns",
						components: [
						{
							content: "See",
							classes: "about-description"
						},
						{
							content: "  ",
							style: "width: 20px;"
						},
						{
							name: "homeValue",
							kind: "enyo.Control",
							tag: "a",
							content: "Project Homepage",
							attributes: {
								"target": "_blank"
							}
						}]
					},
					{
						kind: "FittableColumns",
						style: "height: 100%;",
						components: [
						{
							content: "License: ",
							classes: "about-description"
						},
						{
							content: "  ",
							style: "width: 20px;"
						},
						{
							name: "license",
							style: "height: 100%;",
							classes: "about-description"
						}]
					}]
				}]
			}]
		},
		{
			kind: "onyx.Toolbar",
			classes: "bottom-bar",
			name: "buttons",
			components: [
			{
				name: "cancelButton",
				classes: "button",
				kind: "onyx.Button",
				content: "Close",
				ontap: "actionClose"
			}]
		}]
	}],

	/**
	 * @protected
	 */
	create: function () {
		this.inherited(arguments);
		this.aboutData();
	},

	/**
	 * @private
	 */
	aboutData: function () {
		this.$.versionValue.content = "\t" + "0.2.0";
		this.$.brValue.setAttribute("href", "http://issues.webos-ports.org/");
		this.$.homeValue.setAttribute("href", "https://github.com/webOS-ports/org.webosports.app.calculator");
		this.$.license.content = "	";
	},
	actionClose: function () {
		this.hide();
		return true;
	}
});
