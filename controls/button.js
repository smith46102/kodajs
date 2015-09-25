
function GuiButton(dom, gui, options) {
	this.construct(dom, gui, options);
}

Gui.extend(GuiButton, GuiElement, {

	construct: function(dom, gui, options) {
		this.__inherit.construct.apply(this, arguments);
		var _this = this;
		this.dom.bind('mousedown', function(e) { _this.mouseDown.call(_this, e); });
		this.dom.bind('mouseup', function(e) { _this.mouseUp.call(_this, e); });
		this.dom.bind('keydown', function(e) { _this.keyDown.call(_this, e); });
		this.dom.bind('keyup', function(e) { _this.keyUp.call(_this, e); });
	},

	mouseDown: function(e) {
		this.pushed(true);
		e.stopPropagation();
		return false;
	},

	mouseUp: function(e) {
		if (this.pushed() && !this.dom.hasClass('_loading')) {
			this.click();
		}
		this.pushed(false);
		e.stopPropagation();
		return false;
	},

	keyDown: function(e) {
		if (e.which == 13 || e.which == 32) {
			this.pushed(true);
			e.stopPropagation();
			return false;
		}
		return true;
	},

	keyUp: function(e) {
		if (e.which == 13 || e.which == 32) {
			if (this.pushed()) { this.click(); }
			this.pushed(false);
			e.stopPropagation();
			return false;
		}
		return true;
	},

	click: function() {
		return this.fire('click', this.attr('value'));
	},

	pushed: function(pushed) {
		if (pushed === true) {
			this.dom.addClass('_pushed');
		} else if (pushed === false) {
			this.dom.removeClass('_pushed');
		} else {
			return this.dom.hasClass('_pushed');
		}
	},

	startLoading: function() {
		this.dom.addClass('_loading');
		this.dom.setAttribute('disabled', 'disabled');
	},

	stopLoading: function() {
		this.dom.removeClass('_loading');
		this.dom.removeAttribute('disabled');
	}

});

Gui.registerElement(GuiButton, 'button');