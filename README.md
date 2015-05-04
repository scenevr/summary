# Summary

Create an html summary of a scenevr scene. This code connects to a scenevr server and parses the first scene description packet,
then converts the content to an approximation in html. This html can be used by screen scrapers, text clients and search
engines to get an idea of what the scene contains.

## Usage

```javascript
var summary = require('scenevr-summary')
summary('//home.scenevr.hosting/home.xml', function (html){
  console.log(html);
})
```
