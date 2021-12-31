# subscene

Small project for Download Subtitle From [SUBSCENE](https://www.subscene.com/)

**Important : This is not an official project, so there is no guarantee that it will work for a long time.**

### Require Module
```javascript
const subscene = require("subscene")
```

### How to search a movie?

```javascript
const subscene = require("subscene") //require Module

//Search A Movie/series Name Query
subscene.search(query).then(results=> {

  //results may be an array or null

}).catch(err=> {

  //Handle Errors

})


/* An Example For How to Use Search Function*/

subscene.search("Money heist").then(results=> {
  /*
  [
    {
      title:"money heist",
      path:"/subtitle/money-heist"
    },
    {
      title:".....",
      path:"...."
    }.....
  ]
  */
})

```