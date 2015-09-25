
function GuiController() {}

GuiController.prototype = {

	dom: null,
	parentGui: null,
	loadPath: '',

	// construct, remember dom
	construct: function(dom, parentGui) {
		if (dom instanceof HTMLElement) {
			this.dom = dom;
		} else if (typeof dom == "string") {
			this.dom = document.querySelector(dom);
		}
		if (this.dom) {
			this.dom.removeAttribute('gui');
			this.dom && this.activate();
		}
		this.parentGui = parentGui || null;
	},

	// activate kels
	activate: function(selector) {
		if (!this.dom) return false;
		var dom = this.dom;
		if (typeof selector == 'string') {
			dom = this.dom.findOne(selector);
		} else if (selector instanceof HTMLElement) {
			dom = selector;
		}

		// 1. create and activate inner gui controllers
		var guis = dom.find('[gui]');
		for (var i = 0; i < guis.length; i++) {
			var guiDom = guis[i];
			var guiName = guiDom.attr('gui');
			Gui.createGui(guiName, guiDom, this);
		}

		// 2. activate gui elements
		var kels = dom.find('[kel]');
		for (var i = 0; i < kels.length; i++) {
			var keldom = kels[i];
			var elementName = keldom.attr('kel');
			Gui.createElement(elementName, keldom, this);
		}
	},

	// find control by name
	getElement: function(name) {
		if (!this.dom) return false;
		var dom = this.dom.findOne('[name="' + name + '"]');
		return (dom && dom.kel) ? dom.kel : null;
	},

	// load dom by XHR
	load: function(url, data, callback) {
		var _this = this;
		Gui.sendXHR("POST", this.loadPath + url, data, function(result) {
			if (result.status == 'system_error') {
				console.warn(url, data, result);
			} else {
				callback && callback.call(_this, result);
			}
		}, true);
	},

	// check for action method and call it
	action: function(name, element, data) {
		var action = this[name] || null;
		if (action && (typeof action === 'function')) {
			return action.call(this, element, data);
		}
		return false;
	},

}