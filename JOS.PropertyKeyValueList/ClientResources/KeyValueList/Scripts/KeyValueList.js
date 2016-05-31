define(
	"keyvaluelist/scripts/KeyValueList",
	[
		"dojo/_base/array",
		"dojo/_base/declare",
		"dojo/_base/lang",
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/on",
		"dijit/focus",
		"dijit/_TemplatedMixin",
		"dijit/_WidgetBase",
		"dijit/form/ValidationTextBox",
		"dijit/form/Button",
		"epi/shell/widget/_ValueRequiredMixin",
		"dojo/text!../Templates/KeyValueList.html",
		"xstyle/css!../Styles/keyvaluelist.css"
	],
	function(array,
		declare,
		lang,
		domStyle,
		domConstruct,
		on,
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
			valueIsCsv: true,
			valueIsInclusive: true,
			value: null,
			widgetsInTemplate: true,
			_calculateValue: function() {
				var value = [];
				var isReadOnly = this.readOnlyKeysMode;
				array.forEach(this._keyValueItems,
					function(entry) {
						var keyTextbox = entry.keyTextbox;
						var valueTextbox = entry.valueTextbox;
						var keyValuePair = {};
						if (isReadOnly) {
							keyValuePair.key = keyTextbox.value;
							keyValuePair.value = valueTextbox.value;
						} else if (keyTextbox.value && valueTextbox.value && keyTextbox.isValid() && valueTextbox.isValid()) {
							keyValuePair.key = keyTextbox.value;
							keyValuePair.value = valueTextbox.value;
						}
						value.push(keyValuePair);
					});
				this._set("value", value);
			},
			_createTextbox: function(value, cssClass) {
				var tb = new Textbox({
					value: value
				});
				tb.setAttribute("class", cssClass);

				tb.on("change",
					lang.hitch(this,
						function() {
							this._calculateValue();
							this.onChange(this.value);
						}));
				tb.on("focus",
					lang.hitch(this,
						function() {
							this._set("focused", true);
							this.onFocus();
						}));
				tb.on("blur",
					lang.hitch(this,
						function() {
							this._set("focused", false);
							this._onBlur();
						}));

				return tb;
			},
			_createReadOnlyTextbox: function(value) {
				var tb = new Textbox({
					value: value,
					tabIndex: -1,
					title: "You can't edit this field. It's used as an unique identifier."
				});
				return tb;
			},
			_getSavedValueForReadOnlyKey: function(key) {
				var value = this.value;
				var result = array.filter(value,
					function(item) {
						return item.key === key;
					});

				if (result.length > 0) {
					return result[0].value;
				}

				return "";
			},
			_onBlur: function() {
				this.inherited(arguments);
				this.onBlur();
			},
			_pushKeyValueItem: function(div, keyTextbox, valueTextbox) {
				var o = new Object();
				o.div = div;
				o.keyTextbox = keyTextbox;
				o.valueTextbox = valueTextbox;

				this._keyValueItems.push(o);
			},
			_removeKeyValueItem: function(div) {
				var newKeyValueItems = [];

				array.forEach(this._keyValueItems,
					function(entry) {
						if (entry.div !== div) {
							newKeyValueItems.push(entry);
						}
					});

				this._keyValueItems = newKeyValueItems;
			},
			_renderNormalMode: function(keyValueItem) {
				var div = domConstruct.create("div", null, this.keyValueItemsNode);
				div.setAttribute("class", "keyValueItemContainer");

				var keyTextbox = this._createTextbox(keyValueItem.key, "keyTextbox");
				var valueTextbox = this._createTextbox(keyValueItem.value, "valueTextbox");

				keyTextbox.placeAt(div);
				valueTextbox.placeAt(div);

				var btn = new button({
					label: "X",
					main: this,
					container: div
				});
				btn.on("click",
					function() {
						this.main._removeKeyValueItem(this.container);
						domConstruct.destroy(this.container);
						this.main._calculateValue();
						this.main.onChange(this.main.value);

					});
				btn.placeAt(div);

				this._pushKeyValueItem(div, keyTextbox, valueTextbox);
			},
			_renderReadOnlyMode: function(key) {
				var div = domConstruct.create("div", null, this.keyValueItemsNode);
				div.setAttribute("class", "keyValueItemContainer");

				var keyTextbox = this._createReadOnlyTextbox(key);
				keyTextbox.setAttribute('readonly', 'readonly');
				keyTextbox.setAttribute('class', 'kvl-disabled');
				var value = this._getSavedValueForReadOnlyKey(key);
				var valueTextbox = this._createTextbox(value, "valueTextbox");

				keyTextbox.placeAt(div);
				valueTextbox.placeAt(div);

				this._pushKeyValueItem(div, keyTextbox, valueTextbox);
			},
			_setValueAttr: function(value) {
				this._set("value", value);
				this.initializeProperty();
			},
			addKeyValueItem: function() {
				if (this.readOnlyKeysMode) {
					return;
				}
				this._renderNormalMode({ "Key": "", "Value": "" });
			},
			constructor: function() {
				this._keyValueItems = [];
			},
			destroy: function() {
				var _a;
				while (_a = this._keyValueItems.pop()) {
					_a.div.destroyRecursive();
				}
				this.inherited(arguments);
			},
			focus: function() {
				try {
					if (this._keyValueItems.length > 0) {
						focus.focus(this._keyValueItems[0].div.keyValueItemsNode);
					}
				} catch (e) {
				}
			},
			isValid: function() {
				var isValid = true;
				if (!this.isReadOnlyKeyMode) {
					array.forEach(this._keyValueItems,
						function(entry) {
							var keyTextbox = entry.keyTextbox,
							    valueTextbox = entry.valueTextbox;

							isValid = isValid && keyTextbox.isValid() && valueTextbox.isValid();
						});
				}
				return isValid;
			},
			initializeProperty: function() {
				if (this.readOnlyKeysMode) {
					domStyle.set(this.kvlAddButton,
					{
						"display": "none"
					});

					array.forEach(this.readOnlyKeys, this._renderReadOnlyMode, this);
				} else {
					array.forEach(this.value, this._renderNormalMode, this);
				}
			},
			onChange: function(value) {
				//This is a chrome fix
				if (this.parent) {
					this.parent.save(value);
				}
			},
			postCreate: function() {
				this.inherited(arguments);
				this.readOnlyKeysMode = this.readOnlyKeys !== undefined && this.readOnlyKeys.length > 0;
			}
		});
	});