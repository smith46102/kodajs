
function GuiTabs(dom, gui) {
	this.construct(dom, gui);
}

Gui.extend(GuiTabs, GuiElement, {

	activeTab: '',
	buttons: null,
	tabs: null,

	// get buttons and tabs
	construct: function() {
		this.__inherit.construct.apply(this, arguments);

		this.buttons = this.dom.find('.js-tab-button');
		this.tabs = this.dom.find('.js-tab');

		if (this.buttons) {
			for (var i = 0; i < this.buttons.length; i++) {
				this.buttons[i].bind('mousedown', this.tabClick);
				this.buttons[i].kel = this;
			}
		}

		this.setActive(this.attr('activeTab'));
	},

	// set new active tab
	setActive: function(name) {
		this.activeTab = newTab;
		var newTab = this.dom.findOne('[tab="' + name + '"]');
		if (newTab && !newTab.hasClass('_active')) {
			this.tabChange(newTab);
		}
	},

	tabClick: function(e) {
		var tab = this;
		var _this = tab.kel;
		var tabName = tab.attr('tab');
		_this.activeTab = tabName;
		if (_this.tabChange(tab)) {
			_this.fire('change', tabName);
		}
	},

	// change styles of tabs, switching them
	tabChange: function(tab) {
		var _this = tab.kel;
		var tabName = tab.attr('tab');
		var buttons = tab.kel.buttons;
		var tabs = tab.kel.tabs;

		if (!tab.hasClass('_active')) {
			// switch buttons
			for (var i = 0; i < buttons.length; i++) {
				buttons[i].removeClass('_active');
			}
			tab.addClass('_active');

			// switch tabs
			if (_this.tabs && _this.tabs.length > 0) {
				_this.activeTab = null;
				for (var i = 0; i < tabs.length; i++) {
					if (tabs[i].attr('tab') == tabName) {
						tabs[i].addClass('_active');
					} else {
						tabs[i].removeClass('_active');
					}
				}
			}

			return true;
		}
		return false;
	}

});

Gui.registerElement(GuiTabs, 'tabs');
