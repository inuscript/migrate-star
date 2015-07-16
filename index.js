var requestAllPages = require("request-all-pages")
var GitHubApi = require("github")
var oldName = "suisho"
var starListUrl = "https://api.github.com/users/" + oldName + "/starred"

var option = {  
  uri: starListUrl,
  json: true,
  body: {},
  headers: {
    'User-Agent': 'Request'
  }
}

var requestCurrentStarred = new Promise(function(resolve, reject){
  requestAllPages(option, function(err, pages){
    var repos = pages.reduce(function(acc, page){
      var data = page.body.map(function(item){
        return item.full_name
      })
      return acc.concat(data)
    }, [])
    resolve(repos)
  })
})

requestCurrentStarred.then(function(data){
  console.log(data)
}).catch(function(e){
  console.log(e)
})
// var github = new GitHubApi({
// })
