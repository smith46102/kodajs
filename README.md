Koda JS
=======

Simple JS framework for creating active interfaces.


Features
--------

* GUI declared by parent- controller objects
* Controllers construct active GUI elements from HTML they own
* Elements uses HTML-attributes as options
* Elements can call parent GUI actions as event callbacks
* Module structure, write your own control-elements, and controllers
* Complex gui elements must be profidedd with specific html layout


Example usage
-------------

First, create html layout:

```html
<div class="popup">
	<button class="button" kel="button" click="submit">Submit</button>
	<button class="button" kel="button" click="cancel">Cancel</button>
</div>
```

Define GUI controller class:

```js
function PopupController(dom) {
	this.construct(dom);
}

Gui.extend(PopupController, GuiController, {

	// submit action
	submit: function(button, value) {
		// do something...
	},

	// cancel action
	cancel: function(button, value) {
		// do something...
	}

});
```

Create GUI controller object:

```js
// create controller
var popup = new PopupController('.popup');
// activate control-elements
popup.activate();
```