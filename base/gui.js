
var Gui = (function() {

	var _this = {};

	_this.elements = {};
	_this.guis = {};

	_this.extend = function(child, parent, options) {
		child.prototype = new parent();
		child.prototype.constructor = child;
		child.prototype.__inherit = parent.prototype;

		if (options !== undefined) {
			for (var i in options) {
				if (options.hasOwnProperty(i)) {
					child.prototype[i] = options[i];
				}
			}
		}
	}

	_this.serialize = function(data) {
		var string = [];
		for (var field in data) {
			if (data.hasOwnProperty(field)) {
				string.push(field + '=' + encodeURIComponent(data[field]));
			}
		}
		return string.join('&');
	}

	_this.sendXHR = function(method, url, data, callback, outJson) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 ) {
				if (xhr.status == 200) {
					var result = '';
					try {
						result = outJson ? JSON.parse(xhr.responseText) : xhr.responseText;
					} catch (e) {
						console.warn('wrong json format on request: ' + url, data);
						console.warn(xhr.responseText);
					}
					callback && callback(result);
				} else if (xhr.status == 400) {
					console.warn('there is an error 400 ' + url);
				} else {
					console.warn('wrong return code on request ' + url);
				}
			}
		}
		xhr.open(method, url, true);
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(_this.serialize(data));
	}

	_this.registerElement = function(constructor, name) {
		_this.elements[name] = constructor;
	}

	_this.registerGui = function(constructor, name) {
		_this.guis[name] = constructor;
	}

	_this.createElement = function(name, dom, gui, options) {
		var constructor = _this.elements[name];
		if (constructor !== undefined) {
			return new constructor(dom, gui, options);
		} else {
			console.warn('unregistered gui element: ' + name);
			return false;
		}
	}

	_this.createGui = function(name, dom, parentGui) {
		var constructor = _this.guis[name];
		if (constructor !== undefined) {
			return new constructor(dom, parentGui);
		} else {
			console.warn('unregistered gui controller: ' + name);
			return false;
		}
	}

	_this.createNode = function(htmlString) {
		var node = document.createElement("DIV");
		node.innerHTML = htmlString;
		return node.firstChild;
	}

	// improve HTMLElement prototype

	HTMLElement.prototype.addClass = function() {
		this.classList.add.apply(this.classList, arguments);
		return this;
	}

	HTMLElement.prototype.removeClass = function() {
		this.classList.remove.apply(this.classList, arguments);
		return this;
	}

	HTMLElement.prototype.hasClass = function(name) {
		return this.classList.contains(name);
	}

	HTMLElement.prototype.attr = function(name, value) {
		if (value !== undefined) {
			this.setAttribute(name, value);
			return this;
		} else {
			return this.getAttribute(name);
		}
	}

	HTMLElement.prototype.bind = function(eventName, func) {
		this.addEventListener(eventName, func, false);
		return this;
	}

	HTMLElement.prototype.find = function(selector) {
		return this.querySelectorAll(selector);
	}

	HTMLElement.prototype.findOne = function(selector) {
		return this.querySelector(selector);
	}

	HTMLElement.prototype.append = function(htmlString) {
		var node = document.createElement("DIV");
		node.innerHTML = htmlString;
		var nodes = node.children;
		var length = nodes.length;

		for (var i = 0; i < length; i++) {
			this.appendChild(nodes[0]);
		}
	}

	HTMLElement.prototype.isDescendantOf = function(parent) {
	     var node = this.parentNode;
	     while (node != null) {
	         if (node == parent) {
	             return true;
	         }
	         node = node.parentNode;
	     }
	     return false;
	}

	NodeList.prototype.each = function(func) {
		for (var i = 0; i < this.length; i++) {
			func.call(this, this[i]);
		}
	}

	return _this;

})();