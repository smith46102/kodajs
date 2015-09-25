
function GuiAutocomplete(dom, gui) {
	this.construct(dom, gui);
}

Gui.extend(GuiAutocomplete, GuiElement, {

	input: null,
	resultInput: null,
	result: null,
	menu: null,
	options: null,
	clearButton: null,

	construct: function(dom, gui) {
		this.__inherit.construct.apply(this, arguments);
		this.input = this.dom.findOne('.js-input');
		this.resultInput = this.dom.findOne('.js-result');
		this.menu = this.dom.findOne('.js-menu');
		this.options = this.dom.find('.js-option');
		this.clearButton = this.dom.findOne('.js-clear');

		var _this = this;
		this.input.bind('focus', function(e) { _this.focus.call(_this, e); });
		this.input.bind('blur', function(e) { _this.blur.call(_this, e); });
		this.input.bind('keydown', function(e) { _this.inputKeyDown.call(_this, e); });
		this.input.bind('keyup', function(e) { _this.inputKeyUp.call(_this, e); });
		this.clearButton.bind('mousedown', function(e) { _this.clear.call(_this, e); });

		if (this.options) {
			for (var i = 0; i < this.options.length; i++) {
				this.options[i].bind('mousedown', function(e) { _this.optionClick.call(_this, this, e); });
			}
		}
	},

	focus: function(e) {
		if (e === undefined) {
			this.input.focus();
		}
		this.filterMenu();
		this.showMenu();
	},

	blur: function(e) {
		if (e === undefined) {
			this.input.blur();
		}
		this.hideMenu();
	},

	// on Enter OR Tab choose first in list
	inputKeyDown: function(e) {
		if (e.keyCode == 13) {
			var firstOption = this.dom.findOne('.js-option:not(._hidden)');
			this.optionClick(firstOption);

			e.stopPropagation();
			e.preventDefault();
			return false;
		}
	},

	inputKeyUp: function(e) {
		this.filterMenu();

		if (this.input.value !== '') {
			this.clearButton.removeClass('_hidden');
		} else {
			this.clearButton.addClass('_hidden');
		}
	},

	clear: function(e) {
		this.input.value = '';
		this.result = this.resultInput.value = '';
		this.input.blur();
		this.hideMenu();
		this.clearButton.addClass('_hidden');
	},

	showMenu: function(e) {
		this.menu.removeClass('_hidden');
	},

	hideMenu: function(e) {
		this.menu.addClass('_hidden');
	},


	filterMenu: function() {
		if (!this.options) { return false; }

		for (var i = 0; i < this.options.length; i++) {
			var option = this.options[i];
			var search = option.attr('search');
			var regex = new RegExp(this.input.value, 'ig');

			if (search.match(regex)) {
				option.removeClass('_hidden');
			} else {
				option.addClass('_hidden');
			}
		}

		var hiddenOptions = this.dom.find('.js-option._hidden');
		if (hiddenOptions.length == this.options.length) {
			this.dom.findOne('.js-empty-menu').removeClass('_hidden');
		} else {
			this.dom.findOne('.js-empty-menu').addClass('_hidden');
		}
	},


	optionClick: function(option, e) {
		this.input.value = option.innerHTML;
		this.result = this.resultInput.value = option.attr('value');
		this.clearButton.removeClass('_hidden');
		this.fire('select', this.result);
		this.hideMenu();
	}

});

Gui.registerElement(GuiAutocomplete, 'autocomplete');