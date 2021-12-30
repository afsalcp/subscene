const request = require("request"),
cheerio = require("cheerio"),
baseUrl = "https://subscene.com",
userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/434.36",
unzip = require("adm-zip")

function get(url, data, cb, type) {
  try {
    request({
      url, method: type || "post", json: data, headers: {
        "User-Agent": userAgent
      }}, (err, res)=> {
      cb(err, res)
    })
  }catch(err) {
    cb(err)
  }
}

function search(query = String) {
  return new Promise((resolve, reject)=> {
    try {
      if (query) {
        get(baseUrl+"/subtitles/searchbytitle", {
          query
        }, async(err, res)=> {
          try {
            if (!err) {
              var $ = cheerio.load(res.body)
              let results = []
              $(".search-result ul a").map((i, el)=> {
                if (el.attribs && el.attribs.href && el.children && el.children[0] && el.children[0].data) {
                  var data = {
                    url: el.attribs.href,
                    title: el.children[0].data
                  }
                  results.push(data)
                }
              })
              resolve(results || null)
            } else reject(err)
          }catch(err) {
            reject(err)
          }
        })
      }
    }catch(err) {
      reject(err)
    }
  })
}

function subtitle(url = String) {
  return new Promise((resolve,
    reject)=> {
    try {
      get(baseUrl+ url,
        null,
        async(err, res)=> {
          try {
            if (!err) {
              var $ = cheerio.load(res.body)
              let results = []
              $("table tr .a1 a").map((i, e)=> {
                if (e.attribs && e.attribs.href) {
                  var url = e.attribs.href,
                  title,
                  lang
                  e.children.map((e2, j)=> {
                    try {
                      if (e2.type === "tag" && e2.name === "span") {

                        if (!lang)lang = e2.children[0].data.replace(/\t|\n|\r/g, "")
                        else title = e2.children[0].data.replace(/\t|\n|\r/g, "")
                      }
                    }catch(err) {
                      lang = "notSp",
                      title = "no Title Found"
                    }
                  })
                  results.push({
                    url,
                    title: title || "no title found",
                    lang: lang || "notSp"
                  })
                }
              })
              resolve(sortByLang(results) || null)
            } else throw err
          }catch(err) {
            reject(err)
          }
        },
        "get")
    }catch(err) {
      reject(err)
    }
  })
}

function sortByLang(subs = Array) {
  try {
    let sorted = {}
    subs.map((e,
      i)=> {
      if (sorted[e.lang.toLowerCase()]) {
        sorted[e.lang.toLowerCase()].push(e)
      } else {
        sorted[e.lang.toLowerCase()] = [e]
      }
    })
    return sorted
  }catch(err) {
    return null
  }
}

function download(url = String) {
  return new Promise((resolve, reject)=> {
    try {
      get(baseUrl+url, null, (err, res)=> {
        try {
          if (!err) {
            var $ = cheerio.load(res.body),
            downUrl
            $("#downloadButton").map((i, e)=> {
              downUrl = e.attribs.href
            })
            request({
              url: baseUrl+downUrl, headers: {
                "User-Agent": userAgent
              }, encoding: null
            }, async(err, res)=> {
              try {
                if (err)reject(err)
                else {
                  var zip = new unzip(res.body)
                  var zipData = []
                  zip.getEntries().map((e, i)=> {
                    if (e.name && e.getData && e.getData())
                      zipData.push({
                      filename: e.name, buffer: e.getData()})
                  })
                  resolve(zipData)
                }
              }catch(err){reject(err)}
            })
          } else reject(err)
        }catch(err) {
          reject(err)
        }
      },
        "get")
    }catch(err) {
      reject(err)
    }
  })
}

module.exports.search = search
module.exports.subtitles = subtitle
module.exports.download = download