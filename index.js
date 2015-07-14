var request = require("request")
// var GitHubApi = require("github")
var oldName = "suisho"
var starListUrl = "https://api.github.com/users/" + oldName + "/starred"
var option = {  
  url: starListUrl,
  headers: {
    'User-Agent': 'Request'
  }
}


request(option, function(err, res, body){
  console.log(res.headers.link)
  var data = JSON.parse(body).map(function(item){
    return item.full_name
  })
  // console.log(data)
})
// var github = new GitHubApi({
// })
