# JOS.PropertyKeyValueList
### Custom EPiServer key value list property with support for predefined keys.

Install it by simply running ```Install-Package JOS.PropertyKeyValueList``` in the Package manager console.

Tested in alloy project with **EPiServer.CMS 9.7** and **EPiServer.CMS.UI 9.4.3**. 

Inspired by [this blogpost by Peter Löfman](http://epideveloper.blogspot.se/2013/10/episerver-7-custom-property-combined.html) where he had done something quite similar to what I wanted to achieve so I used his blog post to get started.

The property has two "modes", ```ReadOnlyKeys``` or ```Normal```.

#### ReadOnlyKeys
Add the property like this to try it out.
```csharp
[BackingType(typeof(PropertyKeyValueList))]
[KeyValue(typeof(ReadOnlyKeysProvider))]
public virtual IEnumerable<KeyValueItem> ReadOnly { get; set; }
```
ReadOnlyMode is specified by passing in an ```IReadOnlyKeysProvider``` to the constructor of the ```KeyValueAttribute```.

**IReadOnlyKeysProvider**
```csharp
public interface IReadOnlyKeysProvider
{
    List<string> GetKeys();
}
```
My implementation in this example looks like this:
**ReadOnlyKeysProvider**
```csharp
public class ReadOnlyKeysProvider : IReadOnlyKeysProvider
{
    public List<string> GetKeys()
    {
        return new List<string>()
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
```

When specifying a ```IReadOnlyKeysProvider``` the property will render in ReadOnlyKeysMode and look like this:
![Property rendered in readOnlyKeysMode](https://josefottosson.se/content/images/2016/05/readOnlyKeysMode--1-.PNG)
The editor will only be able to edit the "value" portion of the property, not the predefined keys. It's not possible to add new items in this mode.

#### Normal
Add the property like this to try it out.
```csharp
[BackingType(typeof(PropertyKeyValueList))]
[KeyValue]
public virtual IEnumerable<KeyValueItem> NotReadOnly { get; set; }
```
The property will look like this in edit mode:
![Property rendered in normal mode](https://josefottosson.se/content/images/2016/05/normalMode-1.gif)
Currently it's possible to add as many items as you like but Im thinking of adding an optional MaxLimit.
