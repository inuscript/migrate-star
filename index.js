var requestAllPages = require("request-all-pages")
var GitHubApi = require("github")
var through = require("through")
var setting = require("./setting.json")
var githubRequest = function(url){
  return {  
    uri: url,
    json: true,
    body: {},
    headers: {
      'User-Agent': 'Request'
    }
  }
}

var requestCurrentStarred = new Promise(function(resolve, reject){
  var starListUrl = "https://api.github.com/users/" + setting.oldName + "/starred"

  var option = githubRequest(starListUrl)

  var opt = { 
    limit: { maxPages: 2, abort: false }
  }
  var queue = []
  requestAllPages(option, opt)
    .pipe(through(function (data) {
        var page = JSON.parse(data)
        var data = page.body.map(function(item){
          return item.full_name
        })
        queue = queue.concat(data) // SO EVIL
      }
    ))
    .on("end", function(err, data){
      resolve(queue)
    })
})

function doStar(data){
  console.log(data)
  // PUT /user/starred/:owner/:repo
}
requestCurrentStarred.then(doStar).catch(function(e){
  console.log(e)
})
// var github = new GitHubApi({
// })
