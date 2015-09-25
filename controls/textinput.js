
function GuiTextInput(dom, gui, options) {
	this.construct(dom, gui, options);
}

Gui.extend(GuiTextInput, GuiElement, {

	changed: false,
	startValue: '',

	construct: function(dom, gui, options) {
		this.__inherit.construct.apply(this, arguments);
		this.startValue = this.dom.value;
		var _this = this;
		this.dom.bind('focus', function(e) { _this.focus.call(_this, e); });
		this.dom.bind('blur', function(e) { _this.blur.call(_this, e); });
		this.dom.bind('keyup', function(e) { _this.keyup.call(_this, e); });
	},

	focus: function(event) {
		if (!event) {
			this.dom.focus();
		} else {
			this.dom.addClass('_focused');
			this.fire('focus');
		}
	},

	blur: function(event) {
		if (!event) {
			this.dom.blur();
		} else {
			this.dom.removeClass('_focused');
			this.fire('blur');
		}
	},

	keyup: function(event) {
		if (this.dom.value !== this.startValue) {
			this.changed = true;
		}
		return true;
	},

	refreshStartValue: function() {
		this.startValue = this.dom.value;
		this.changed = false;
	},

	restoreStartValue: function() {
		this.dom.value = this.startValue;
		this.changed = false;
	}

});

Gui.registerElement(GuiTextInput, 'textinput');