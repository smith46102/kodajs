
function GuiLink(dom, gui, options) {
	this.construct(dom, gui, options);
}

Gui.extend(GuiLink, GuiElement, {

	href: null,

	construct: function(dom, gui, options) {
		this.__inherit.construct.apply(this, arguments);
		this.href = this.dom.attr('href');
		this.dom.removeAttribute('href');

		var _this = this;
		this.dom.bind('click', function(e) { _this.click.call(_this, e); });
	},

	click: function() {
		this.fire('click', this.href);
		Router.go(this.href);
	}

});

Gui.registerElement(GuiLink, 'link');