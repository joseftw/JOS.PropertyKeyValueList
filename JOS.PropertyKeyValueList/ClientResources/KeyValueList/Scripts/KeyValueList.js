define(
	"keyvaluelist/scripts/KeyValueList",
	[
		"dojo/_base/array",
		"dojo/_base/declare",
		"dojo/_base/lang",
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/on",
		"epi/epi",
		"dijit/focus",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetBase",
		"dijit/form/ValidationTextBox",
		"dijit/form/Button",
		"epi/shell/widget/_ValueRequiredMixin",
		"dojo/text!../Templates/KeyValueList.html",
		"xstyle/css!../Styles/keyvaluelist.css"
	],
	function (array,
		declare,
		lang,
		domStyle,
		domConstruct,
		on,
		epi,
		focus,
		templatedMixin,
		widget,
		Textbox,
		button,
		valueRequiredMixin,
		Template) {
		return declare([widget, templatedMixin, valueRequiredMixin],
		{
			templateString: Template,
			baseClass: "keyValueList",
			readOnlyKeysMode: false,
			value: null,
			widgetsInTemplate: true,
			addKeyValueItem: function () {
				if (this.readOnlyKeysMode) {
					return;
				}

				var li = domConstruct.create("li", null, this.kvlList);
				var keyTextBox = this._createTextBox(true);
				var valueTextBox = this._createTextBox(true);
				keyTextBox.placeAt(li);
				valueTextBox.placeAt(li);
				var removeImg = domConstruct.create("img", { "class": "kvl-icon", "src": "/ClientResources/KeyValueList/Images/remove.svg" }, li);
				var item = {
					keyTextBox: keyTextBox,
					valueTextBox: valueTextBox
				};

				this._registerRemoveEvent(removeImg, li, this, item);
				this._keyValueItems.push(item);
			},
			buildRendering: function () {
				this.inherited(arguments);
				this.readOnlyKeysMode = this.readOnlyKeys !== undefined && this.readOnlyKeys.length > 0;
				if (this.readOnlyKeysMode) {
					this._renderReadOnly();
				}
			},
			constructor: function () {
				this._keyValueItems = [];
			},
			destroy: function () {
				var _a;
				while (_a = this._keyValueItems.pop()) {
					_a.div.destroyRecursive();
				}
				this.inherited(arguments);
			},
			onChange: function (value) {
				if (this.parent) {
					this.parent.save(value);
				}
			},
			postCreate: function () {
				this.inherited(arguments);
			},
			_calculateValue: function () {
				var propertyValue = [];
				array.forEach(this._keyValueItems, function (item) {
					if (!this.readOnlyKeysMode) {
						var keyIsValid = item.keyTextBox.isValid();
						var valueIsValid = item.valueTextBox.isValid();

						if (!keyIsValid || !valueIsValid) {
							return;
						}
					}

					var keyValueItem = {
						key: item.keyTextBox.get("value"),
						value: item.valueTextBox.get("value")
					};
					propertyValue.push(keyValueItem);
				});

				if (propertyValue.length > 0) {
					this._setValue(propertyValue);
				}
			},
			_createReadOnlyTextBox: function (readOnlyItem) {
				var readOnlyInput = new Textbox({
					value: readOnlyItem,
					tabIndex: -1
				});

				readOnlyInput.setAttribute("class", "kvl-input");
				readOnlyInput.setAttribute("disabled", "disabled");

				return readOnlyInput;
			},
			_createTextBox: function (required) {
				var valueInput = new Textbox({});

				valueInput.on("change", lang.hitch(this, function () {
					this._calculateValue();
				}));

				valueInput.setAttribute("class", "valueTextbox");
				valueInput.setAttribute("class", "kvl-input");

				if (required) {
					valueInput.setAttribute("required", "required");
					valueInput.setAttribute("invalidMessage", "This field is required");
				}

				return valueInput;
			},
			_placeKeyValues: function () {
				for (var i = 0; i < this.value.length; i++) {
					var savedItem = this.value[i];
					var keyTextBox = this._createTextBox(true);
					var valueTextBox = this._createTextBox(true);

					keyTextBox.set("value", savedItem.key, false);
					valueTextBox.set("value", savedItem.value, false);

					var li = domConstruct.create("li", null, this.kvlList);
					keyTextBox.placeAt(li);
					valueTextBox.placeAt(li);
					var removeImg = domConstruct.create("img", { "class": "kvl-icon", "src": "/ClientResources/KeyValueList/Images/remove.svg" }, li);

					var item = {
						keyTextBox: keyTextBox,
						valueTextBox: valueTextBox
					};

					this._keyValueItems.push(item);
					this._registerRemoveEvent(removeImg, li, this, item);
				}
			},
			_placeValues: function () {
				var savedItems = this.value;

				for (var i = 0; i < this._keyValueItems.length; i++) {
					var item = this._keyValueItems[i];
					var key = item.keyTextBox.get("value");

					for (var j = 0; j < savedItems.length; j++) {
						var savedItem = savedItems[j];
						if (key === savedItem.key) {
							item.valueTextBox.set("value", savedItem.value, false);
						}
					}
				}

			},
			_registerRemoveEvent: function (removeImg, li, that, itemToRemove) {
				on(removeImg, 'click', function () {
					$(li).fadeOut(400, function () {
						$(this).remove();
					});

					that._keyValueItems = that._keyValueItems.filter(function (obj) {
						return (obj.keyTextBox.get("value") !== itemToRemove.keyTextBox.get("value") &&
								obj.valueTextBox.get("value") !== itemToRemove.valueTextBox.get("value"));
					});

					that._calculateValue();
				});

			},
			_renderReadOnly: function () {
				domStyle.set(this.kvlAddButton,
				{
					"display": "none"
				});
				var liItemsCount = this.readOnlyKeys.length;

				for (var i = 0; i < liItemsCount; i++) {
					var readOnlyItem = this.readOnlyKeys[i];
					var readOnlyInput = this._createReadOnlyTextBox(readOnlyItem);
					var valueInput = this._createTextBox();

					var li = domConstruct.create("li", null, this.kvlList);
					readOnlyInput.placeAt(li);
					valueInput.placeAt(li);

					var item = {
						keyTextBox: readOnlyInput,
						valueTextBox: valueInput
					};

					this._keyValueItems.push(item);
				}

				domConstruct.place(this.kvlList, this.keyValueItemsNode);
			},
			_setValue: function (value) {
				if (this._started && epi.areEqual(this.value, value)) {
					return;
				}

				if (this._started) {
					this._set("value", value);
					this.onChange(this.value);
				}
			},
			//This gets called on startup by EPI if value != null.
			_setValueAttr: function (value) {
				this._setValue(value);
				if (this.readOnlyKeysMode) {
					this._placeValues();
				} else {
					this._placeKeyValues();
				}
			}
		});
	});