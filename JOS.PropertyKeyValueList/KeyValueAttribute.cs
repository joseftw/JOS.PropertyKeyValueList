using System;
using System.Collections.Generic;

namespace JOS.PropertyKeyValueList 
{
	[AttributeUsage(AttributeTargets.Property)]
	public class KeyValueAttribute : Attribute 
	{
		public List<string> ReadOnlyKeys;

		public KeyValueAttribute() 
		{
			this.ReadOnlyKeys = new List<string>();
		}

		public KeyValueAttribute(Type readOnlyKeysProvider) 
		{
			if (readOnlyKeysProvider.GetInterface(typeof(IReadOnlyKeysProvider).Name) == null) 
			{
				throw new ArgumentException("Parameter readOnlyKeysProvider must implement the IReadOnlyKeysProvider interface");
			}

			var instance = Activator.CreateInstance(readOnlyKeysProvider) as IReadOnlyKeysProvider;

			if (instance == null) 
			{
				throw new ArgumentException("Parameter readOnlyKeysProvider must implement the IReadOnlyKeysProvider interface");
			}

			this.ReadOnlyKeys = instance.GetKeys();
		}
	}
}