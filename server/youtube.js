var request=require("request");
var sanitizeHtml = require("sanitize-html");

const database = require("./database");

exports.getChannels = (req, res) => {
  var data = { userId: req.query.userId };
  console.log(data);

  channels=[];

  getAccessToken(data, getChannels, (response) => {
    res.json(response.sort((a,b) => {
      if(a.displayName<b.displayName) return -1;
      if(a.displayName>b.displayName) return 1;
      return 0;
    }));
  });
}

exports.getPosts = (req, res) => {
  var data = {
    channelId: req.params.channel,
    after: "",
    userId: req.query.userId
  };
  console.log(data);

  getAccessToken(data, getVideos, (response) => {
    res.json(response);
  });
}

var channels=[];

const getAccessToken = (data, run, callback) => {
  database.firestore.collection("auths")
  .where("user", "==", data.userId)
  .where("platform", "==", "google")
  .get().then((snapshot) => {
    if(snapshot.size > 0){
      var url="https://www.googleapis.com/oauth2/v4/token"
              +"?client_id=" + process.env.googleClientId
              +"&client_secret=" + process.env.googleSecret
              +"&refresh_token=" + snapshot.docs[0].data().refreshToken
              +"&grant_type=refresh_token";

      request.post(url, (error, response, html) =>{
        if(error) console.log(error);
        var json = JSON.parse(html);

        run(data, json.access_token, null, callback);
      });
    }
  });
}

const getChannels = (data, accessToken, nextPageToken, callback) => {
  var url = "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50";
  var headers = {
    "Authorization":"Bearer " + accessToken
  };

  if(nextPageToken != null) url += "&pageToken="+nextPageToken;

  request({ url: url,headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    for(var i = 0; i < json.items.length; i++){
      var channel={
        id: json.items[i].snippet.resourceId.channelId,
        displayName: json.items[i].snippet.title,
        logo: json.items[i].snippet.thumbnails.high.url
      };
      channels.push(channel);
    }

    nextPageToken = json.nextPageToken;
    if(nextPageToken == null){
      callback(channels);
    }else{
      getChannels(data, accessToken, nextPageToken, callback);
    }
  });
}

const getVideos = (data, accessToken, nextPageToken, callback) => {
  var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + data.uploadsId + "&maxResults=25&pageToken=" + data.after;
  var headers = {
    "Authorization":"Bearer " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    console.log(json);

    var res = [];
    for(var i = 0; i < json.items.length; i++){
      var video = {
        //videoId: json.items[i].snippet.resourceId.videoId,
        title: sanitizeHtml(json.items[i].snippet.title),
        description: sanitizeHtml(json.items[i].snippet.description),
        date: json.items[i].snippet.publishedAt,
        thumbnail: json.items[i].snippet.thumbnails.high.url,
        after: json.nextPageToken,
      };
      res.push(video);
    }
    callback(res);
  });
}
