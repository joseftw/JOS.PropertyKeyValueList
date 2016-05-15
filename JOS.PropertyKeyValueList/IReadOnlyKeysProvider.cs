using System.Collections.Generic;

namespace JOS.PropertyKeyValueList 
{
	public interface IReadOnlyKeysProvider 
	{
		List<string> GetKeys();
	}
}