
function GuiSelect(dom, gui) {
	this.construct(dom, gui);
}

Gui.extend(GuiSelect, GuiElement, {

	value: null,
	input: null,
	menu: null,
	options: null,

	construct: function(dom, gui) {
		this.__inherit.construct.apply(this, arguments);
		var _this = this;

		this.input = this.dom.findOne('.js-result');

		// set click
		this.value = this.dom.findOne('.js-value');
		this.value.bind('click', function(e) { _this.showList.call(_this, e); });

		// set menu
		this.menu = this.dom.findOne('.js-menu');
		this.menu.attr('tabindex', -1);
		this.menu.bind('blur', function(e) { _this.hideList.call(_this, e) });

		// set options
		this.options = this.dom.find('.js-option');
		if (this.options) {
			for (var i = 0; i < this.options.length; i++) {
				this.options[i].bind('mousedown', function(e) { _this.optionClick.call(_this, this, e); });
			}
		}

		this.setStartValue();
	},

	setStartValue: function() {
		var startVal = this.input.value;
		var option = this.dom.findOne('.js-option[value="' + startVal + '"]');
		if (option) {
			this.optionClick(option, null);
		}
	},

	showList: function(e) {
		this.dom.addClass('_focused');
		this.menu.removeClass('_hidden');
		this.menu.focus();
	},

	hideList: function(e) {
		this.dom.removeClass('_focused');
		this.menu.addClass('_hidden');
	},

	optionClick: function(option, e) {
		this.value.innerHTML = option.innerHTML;
		this.input.value = option.attr('value');
		if (e) {
			this.fire('select', this.input.value);
		}
		this.hideList();
	}

});

Gui.registerElement(GuiSelect, 'select');