# subscene

Small project for Download Subtitle From [SUBSCENE](https://www.subscene.com/)

**Important : This is not an official project, so there is no guarantee that it will work for a long time.**

### Installation
`npm i subscene`

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

### How to get Subtitles?


```javascript
subscene.getSubtitles(moviePath).then(subtitles=> {// "moviePath" is the "path" returned in the subscene.search() function
  console.log(subtitles)
  /*
    {
      english:[
        {
          title:"money-heist s01e01",
          path:"/money-heist/english/028292",
          lang:"English"
        },
        {
          title:"bababa",
          path:"baba a",
          lang:"English"
        }
      ],
      hindi:[
        {
          title:"hindi sub name",
          path:"some path",
          lang:"Hindi"
        }....
      ]....
    },
    
  */

}).catch(err=>console.log(err))
```

### How To Download Subtitle?

```javascript
subscene.download(subtitlePath,options).then(files=>{  // "subtitlePath" is the "path" returned in the subscene.getSubtitles() function
  console.log(files)
  /*
   A buffer will return according to the options
  */
  
}).catch(err=>console.log(err))
```

#### options : `{object}`

*zip :(default false) :*
The zip option refers to whether the file buffer to be returned is zip file buffer or unzipped type buffer. default it will be return unzipped type buffer,
If the zip option is `true` then return value will be an Object 
#### example :-
```javascript
subscene.download(subPath,{zip:true}).then(file=>{
  console.log(file)
  /*
  {
    zip: <Buffer 12 12 221 122...>
  }
  */
})
```

if the zip option is `false` then the response will be an Array

#### example :-

```javascript
subscene.download(subPath).then(file=>{
  console.log(file)
  /*
    [
      {
        filename:"money heist s05e01.srt",
        file:<Buffer 00 11 11 22 112...>
      },
      {
        filename:"money-heist s05e02.srt",
        file:<some buffer>
      }....
    ]
  */
})
```




## One More Example to easly understand

```javascript
subscene.search("money heist").then(res=>{
  /*
  [
  {title:"money heist", path:"some path"}...
  ]
  */
  var selectedSeriesPath=res[0].path //select a path
  subscene.getSubtitles(selectedSeriesPath).then(subtitles=>{
    /*
    {
      english:[
      {title:"some title",path:"some path",lang:"English"}...
      ]
    }...
    */
    var selectedSubtitlePath=subtitles.english[0].path //select a Subtitile path
    subscene.download(selectedSubtitlePath,{zip:false}).then((file)=>{
      /*
      [
      {
        filename:"filename",
        file: buffer
      }...
      ]
      */
      console.log(file[0].file.toString())
      /*
      1
      00:00:01,500 --> 00:00:05,200
      Some diloge is here
      ..
      ..
      ..
      */
    })
  })
})
```