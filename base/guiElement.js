
function GuiElement() {}

GuiElement.prototype = {

	gui: null,
	dom: null,
	options: null,

	construct: function(dom, gui, options) {
		this.gui = gui || this.gui;
		this.dom = dom || this.dom;
		this.options = options || null;
		dom.kel = this;
		dom.removeAttribute('kel');
		if (dom.hasAttribute('name')) {
			this.name = dom.getAttribute('name');
		}
	},

	fire: function(action, data) {
		// call function from options
		if (this.options && this.options[action]) {
			return this.options[action].call(this, data);
		// or call GUI-function from attr name
		} else {
			action = this.attr(action);
			if (action && this.gui) {
				return this.gui.action(action, this, data);
			}
		}
		return null;
	},

	attr: function(name, value) {
		if (!this.dom)
			return false;

		if (value !== undefined) {
			this.dom.attr(name, value);
			return true;
		} else {
			return this.dom.attr(name);
		}
	},

	show: function() {
		if (this.dom.hasClass("_hidden")) {
			this.dom.removeClass("_hidden");
		}
		return this;
	},

	hide: function() {
		if (!this.dom.hasClass("_hidden")) {
			this.dom.addClass("_hidden");
		}
		return this;
	},

	enable: function() {
		if (this.dom.hasClass("_disabled")) {
			this.dom.removeClass("_disabled");
		}
		return this;
	},

	disable: function() {
		if (!this.dom.hasClass("_disabled")) {
			this.dom.addClass("_disabled");
		}
		return this;
	}

}