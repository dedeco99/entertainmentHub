const request = require("request");
var sanitizeHtml = require("sanitize-html");

const database = require("./database");

exports.getSubreddits = (req, res) => {
  var data = { userId: req.query.userId };
  console.log(data);

  getAccessToken(data, getSubreddits, (response) => {
    res.json(response.sort((a, b) => {
      if(a.displayName != "All" && b.displayName != "All"){
        if(a.displayName < b.displayName) return -1;
        if(a.displayName > b.displayName) return 1;
        return 0;
      }
    }));
  });
}

exports.getPosts = (req, res) => {
  var data = {
    subreddit: req.params.subreddit,
    category: req.params.category,
    userId: req.query.userId
  };
  console.log(data);

  getAccessToken(data, getPosts, (response) => {
    res.json(response);
  });
}

var getAccessToken = (data, run, callback) => {
  database.firestore.collection("auths")
  .where("user", "==", data.userId)
  .where("platform", "==", "reddit")
  .get().then((snapshot) => {
    if(snapshot.size > 0){
      var url = "https://www.reddit.com/api/v1/access_token"
              +"?refresh_token=" + snapshot.docs[0].data().refreshToken
              +"&grant_type=refresh_token";

      var auth="Basic " + new Buffer(process.env.redditClientId + ":" + process.env.redditSecret).toString("base64");

      var headers = {
        "User-Agent":"Entertainment-Hub by dedeco99",
        "Authorization": auth
      };

      request.post({ url: url, headers: headers }, (error, response, html) => {
        if(error) console.log(error);
        var json = JSON.parse(html);

        run(data, json.access_token, callback);
      });
    }
  });
}

var getSubreddits = (data, accessToken, callback) => {
  var url = "https://oauth.reddit.com/subreddits/mine/subscriber?limit=1000";
  var headers = {
    "User-Agent":"Entertainment-Hub by dedeco99",
    "Authorization":"bearer " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var res = [];
    var all = "";
    for(var i = 0; i < json.data.children.length; i++){
      var displayName = json.data.children[i].data.display_name;
      all += displayName + "+";
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      var subreddit = {
        id: displayName,
        displayName: displayName
      };
      res.push(subreddit);
    }
    var subreddit = {
      id: all,
      displayName: "All"
    };
    res.unshift(subreddit);
    callback(res, accessToken);
  });
}

var getPosts = (data, accessToken, callback) => {
  var url = "https://oauth.reddit.com/r/" + data.subreddit + "/" + data.category;
  if(data.after) url += "?after=" + data.after;
  var headers = {
    "User-Agent":"Entertainment-Hub by dedeco99",
    "Authorization":"bearer " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    //console.log(json.data.children[0].data);

    var res = [];
    for(var i = 0; i < json.data.children.length; i++){
      var data = json.data.children[i].data;

      if(data.thumbnail == "self" || data.thumbnail == "default"){
        isText = true;
      }

      var redditVideo = null;
      if(data.media && data.media.reddit_video){
        redditVideo = data.media.reddit_video.fallback_url;
      }

      var videoHeight = null, videoPreview = null;
      if(data.media && data.media.oembed){
        videoHeight = data.media.oembed.height;
      }else if(data.preview && data.preview.images && data.preview.images[0].resolutions){
        var resolutions = data.preview.images[0].resolutions;
        if(resolutions[resolutions.length-1]){
          videoPreview = resolutions[resolutions.length-1].url;
        }
      }

      res.push({
        id: i,
        title:data.title,
        permalink:"https://reddit.com/"+data.permalink,
        thumbnail:data.thumbnail,
        upvotes:data.ups,
        downvotes:data.downs,
        comments:data.num_comments,
        crossposts:data.num_crossposts,
        author:data.author,
        domain:data.domain,
        url:data.url,
        text:sanitizeHtml(data.selftext_html),
        redditVideo:redditVideo,
        videoHeight:videoHeight,
        videoPreview:videoPreview,
        created:data.created,
        after:json.data.after
      });
    }
    callback(res);
  });
}
