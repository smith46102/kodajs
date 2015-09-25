
function GuiMenuButton(dom, gui, options) {
	this.construct(dom, gui, options);
}

Gui.extend(GuiMenuButton, GuiElement, {

	button: null,
	menu: null,

	construct: function(dom, gui, options) {
		this.__inherit.construct.apply(this, arguments);
		var _this = this;

		// set button
		this.button = this.dom.findOne('.js-menu-button');
		this.button.bind('click', function() { _this.showMenu.call(_this); });

		// set menu
		this.menu = this.dom.findOne('.js-menu');
		this.menu.attr('tabindex', -1);
		this.menu.bind('blur', function(e) {
			var target = e.relatedTarget;
			if (target === null || !target.isDescendantOf(_this.menu)) {
				_this.closeMenu.call(_this);
			}
		});

		// set items
		var items = this.dom.find('.js-menu-item');
		if (items) {
			for (var i = 0; i < items.length; i++) {
				items[i].bind('click', function() { _this.menuClick.call(_this, this) });
			}
		}
	},

	showMenu: function() {
		this.button.addClass('_pushed');
		this.menu.removeClass('_hidden');
		this.menu.focus();
		return false;
	},

	closeMenu: function() {
		this.button.removeClass('_pushed');
		this.menu.addClass('_hidden');
	},

	menuClick: function(menuItem) {
		this.closeMenu();
		this.fire('select', menuItem);
		return false;
	}

});

Gui.registerElement(GuiMenuButton, 'menubutton');