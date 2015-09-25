
function GuiForm(dom, gui, options) {
	this.construct(dom, gui, options);
}

Gui.extend(GuiForm, GuiElement, {

	construct: function(dom, gui, options) {
		this.__inherit.construct.apply(this, arguments);
		var _this = this;
		this.dom.bind('submit', function(e) { _this.submit.call(_this, e); });
		this.dom.bind('keypress', function(e) { _this.keypress.call(_this, e); });
	},


	// submit form data as XHR
	submit: function(e) {
		// set loading button class
		var button = this.dom.findOne('.js-form-loader');
		button && button.kel && button.kel.startLoading();

		var canSubmit = this.fire('submit') === false ? false : true;

		if (canSubmit) {
			var xhr = new XMLHttpRequest();
			var _this = this;

			xhr.open("POST", this.dom.action);
			xhr.onload = function() {
				if (xhr.readyState == 4 && xhr.status == 200) {
					_this.parseResponse(xhr.responseText);
				}
			};
			xhr.send(new FormData(this.dom));
		}

		if (e !== undefined) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	},


	// parse json response from XHR
	parseResponse: function(text) {
		var result = null;

		try {
			result = JSON.parse(text);
		} catch (exc) {
			console.warn('wrong json on response: ' + this.dom.action, text);
		}

		if (result) this.showErrors(result.errors || {});

		// set loading button class
		var button = this.dom.findOne('.js-form-loader');
		button && button.kel && button.kel.stopLoading();

		result && this.fire('return', result);
	},


	// show form errors or hide old errors
	showErrors: function(errors) {
		var formErrors = this.dom.find('.js-form-error');
		var formInputs = this.dom.find('.js-form-input');

		for (var i = 0; i < formErrors.length; i++) {
			var el = formErrors[i];
			var name = el.attr('error-name');
			if (errors[name] !== undefined) {
				el.innerHTML = errors[name];
				el.removeClass('_hidden');
			} else {
				el.innerHTML = '';
				el.addClass('_hidden');
			}
		}

		for (var i = 0; i < formInputs.length; i++) {
			var el = formInputs[i];
			var name = el.attr('error-name');
			if (errors[name] !== undefined) {
				el.addClass('_error');
			} else {
				el.removeClass('_error');
			}
		}
	},


	validate: function() {
	// 	var result = true;
	// 	$dom.find('input[name],textarea[name],select[name]').filter('[required]').each(function() {
	// 		var input = $(this);
	// 		var val = input.val().replace(/^\s+|\s+$/g, '');
	// 		if (val === '') {
	// 			input.addClass('_requiredAlert');
	// 			result = false;
	// 		}
	// 	});
	// 	return result;
	},


	keypress: function(e) {
		if (e.which == 13 && e.ctrlKey) {
			this.submit();
			return false;
		}
	}

});


Gui.registerElement(GuiForm, 'form');