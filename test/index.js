var subscene=require("../index")

subscene.search("fabricated city").then(res=>{
  subscene.getSubtitles(res[0].path).then(res=>{
    subscene.download(res.english[0].path).then(file=>{
      console.log(file);
    })
  })
}).catch(err=>console.log(err))