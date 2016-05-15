using System;
using System.Collections.Generic;
using EPiServer.Core;
using EPiServer.PlugIn;
using Newtonsoft.Json;

namespace JOS.PropertyKeyValueList
{
    [PropertyDefinitionTypePlugIn(Description = "Listing of key-value-items.", DisplayName = "Key-Value Items")]
    public class PropertyKeyValueList : PropertyLongString
    {
        public override Type PropertyValueType
        {
            get { return typeof(IEnumerable<KeyValueItem>); }
        }

        public override object Value
        {
            get
            {
                var value = base.Value as string;
                return value == null ? null : JsonConvert.DeserializeObject(value, typeof(IEnumerable<KeyValueItem>));
            }
            set
            {
                if (value is IEnumerable<KeyValueItem>)
                {
                    base.Value = JsonConvert.SerializeObject(value);
                }
                else
                {
                    base.Value = value;
                }
            }
        }

        public override object SaveData(PropertyDataCollection properties)
        {
            return LongString;
        }
    }
}