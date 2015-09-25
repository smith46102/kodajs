
function GuiSearch(dom, gui) {
	this.construct(dom, gui);
}

Gui.extend(GuiSearch, GuiElement, {

	input: null,
	clearButton: null,

	construct: function(dom, gui) {
		this.__inherit.construct.apply(this, arguments);
		this.input = this.dom.findOne('.js-search-input');
		this.clearButton = this.dom.findOne('.js-search-clear');
		var _this = this;

		if (this.input) {
			this.input.bind('keyup', function(e) { _this.change.call(_this, e); });
			this.input.bind('focus', function(e) { _this.focus.call(_this, e); });
			this.input.bind('blur', function(e) { _this.blur.call(_this, e); });
		}
		if (this.clearButton) {
			this.clearButton.bind('click', function(e) { _this.clear.call(_this, e); });
		}
	},

	change: function(e) {
		if (this.input.value.length > 0) {
			this.clearButton.removeClass('_hidden');
		} else {
			this.clearButton.addClass('_hidden');
		}
		this.fire('change', this.input.value);

		if (e.keyCode == 13) {
			this.fire('search', this.input.value);
		}
		if (e.keyCode == 27) {
			this.clear();
			this.input.blur();
			this.fire('cancel', this.input.value);
		}

		return false;
	},

	focus: function(e) {
		this.dom.addClass('_focused');
		this.fire('focus', this.input.value);
		return false;
	},

	blur: function(e) {
		this.dom.removeClass('_focused');
		this.fire('blur', this.input.value);
		return false;
	},

	clear: function(e) {
		this.input.value = '';
		this.clearButton.addClass('_hidden');
		this.fire('change', this.input.value);
		return false;
	}

});

Gui.registerElement(GuiSearch, 'search');