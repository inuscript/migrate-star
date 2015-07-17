var requestAllPages = require("request-all-pages")
var request = require("request")
var GitHubApi = require("github")
var through = require("through")
var setting = require("./setting.json")

var authHeader = function(username, token){
  return "Basic " + new Buffer(username + ":" + token).toString("base64");
}

var githubRequest = function(url, username, token){
  var opt = {
    uri: url,
    json: true,
    body: {},
    headers: {
      'User-Agent': 'Request'
    }
  }
  if(username && token){
    opt["headers"]["Authorization"] = authHeader(username, token)
  }
  return opt
}

var requestCurrentStarred = new Promise(function(resolve, reject){
  var starListUrl = "https://api.github.com/users/" + setting.old.name + "/starred"
  var option = githubRequest(starListUrl)

  var opt = { 
    // limit: { maxPages: 2, abort: false }
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

var putStar = function(fullName){
  return new Promise(function(resolve, relect){
    var starUrl = "https://api.github.com/user/starred/" + fullName
    var option = githubRequest(starUrl, setting.new.name, setting.new.token)
    option.method = "PUT"
    request(option, function(err, res, body){
      if(err){
        reject()
        return
      }
      console.log(body)
      resolve()
    })
  })
}
var doStar = function(data){
  var stars = data.map(function(fullName){
    return putStar(fullName)
  })
  var doStars = Promise.all(stars)
  doStars.then(function(){
    console.log("end")
  }).catch(function(e){
    console.log(e)
  })
}
requestCurrentStarred.then(doStar).catch(function(e){
  console.log(e)
})
// var github = new GitHubApi({
// })
