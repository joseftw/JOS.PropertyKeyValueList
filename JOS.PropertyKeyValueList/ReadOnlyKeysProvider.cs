using System.Collections.Generic;

namespace JOS.PropertyKeyValueList 
{
	public class ReadOnlyKeysProvider : IReadOnlyKeysProvider 
	{
		public List<string> GetKeys() 
		{
			return new List<string>
			{
				"Arsenal",
				"Real Madrid",
				"Barcelona",
				"Skara FC",
				"Axvalls IF",
				"Juventus",
				"IFK Göteborg",
				"Djurgårdens IF",
				"AIK"
			};
		}
	}
}