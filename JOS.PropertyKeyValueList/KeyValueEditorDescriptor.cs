using System.Collections.Generic;
using System.Linq;

using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;

namespace JOS.PropertyKeyValueList 
{
	[EditorDescriptorRegistration(TargetType = typeof(IEnumerable<KeyValueItem>))]
	public class KeyValueEditorDescriptor : EditorDescriptor 
		{
		public KeyValueEditorDescriptor() 
		{
			ClientEditingClass = "keyvaluelist.scripts.KeyValueList";
		}

		protected override void SetEditorConfiguration(ExtendedMetadata metadata) 
		{
			var keyValueItemsAttribute = metadata.Attributes.FirstOrDefault(x => typeof(KeyValueAttribute) == x.GetType()) as KeyValueAttribute;

			if (keyValueItemsAttribute == null) 
			{
				base.SetEditorConfiguration(metadata);
				return;
			}

			if(keyValueItemsAttribute.ReadOnlyKeys.Any()) 
			{
				EditorConfiguration["readOnlyKeys"] = keyValueItemsAttribute.ReadOnlyKeys;
			} 
			else 
			{
				EditorConfiguration["readOnlyKeys"] = new List<string>();
			}

			base.SetEditorConfiguration(metadata);
		}
	}
}