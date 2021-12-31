var subscene=require("../index")

subscene.search("uncanny counter").then(res=>{
  subscene.getSubtitles(res[0].path).then(res=>{
    subscene.download(res.english[0].path).then(file=>{
      console.log(file);
    })
  })
}).catch(err=>console.log(err))