var request=require("request");
var sanitizeHtml = require("sanitize-html");

const database = require("./database");

exports.getChannels = (req, res) => {
  var data = { userId: req.query.userId };

  channels = [];
  channelsString = "";

  getAccessToken(data, getChannels, (response) => {
    res.json(response);
  });
}

exports.getPosts = (req, res) => {
  var data = {
    uploadsId: req.params.channel,
    after: "",
    userId: req.query.userId
  };

  getAccessToken(data, getVideoFeed, (response) => {
    res.json(response);
  });
}

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

var channels = [];

const getChannels = (data, accessToken, nextPageToken, callback) => {
  var url = "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50";
  var headers = {
    "Authorization":"Bearer " + accessToken
  };

  if(nextPageToken != null) url += "&pageToken="+nextPageToken;

  request({ url: url,headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var channelsString = "";

    for(var i = 0; i < json.items.length; i++){
      var channel={
        id: null,
        channelId: json.items[i].snippet.resourceId.channelId,
        displayName: json.items[i].snippet.title,
        logo: json.items[i].snippet.thumbnails.high.url
      };
      channels.push(channel);

      channelsString += channel.channelId + ",";
    }

    nextPageToken = json.nextPageToken;
    if(nextPageToken == null){
      getChannelsPlaylist(channelsString.slice(0, -1), accessToken, () => {
        channels.sort((a,b) => {
          if(a.displayName < b.displayName) return -1;
          if(a.displayName > b.displayName) return 1;
          return 0;
        });

        channels.unshift({
          id: 0,
          channelId: null,
          displayName: "All",
          logo: null
        });

        callback(channels);
      });
    }else{
      getChannelsPlaylist(channelsString.slice(0, -1), accessToken, () => {
        getChannels(data, accessToken, nextPageToken, callback);
      });
    }
  });
}

const getChannelsPlaylist = (data, accessToken, callback) => {
  var url = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + data + "&maxResults=50";
  var headers = {
    "Authorization":"Bearer " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    for(var i = 0; i < json.items.length; i++){
      var channel = channels.find(channel => {
        return channel.channelId === json.items[i].id
      });

      channel.id = json.items[i].contentDetails.relatedPlaylists.uploads;
    }

    if(callback) callback(channels);
  });
}

const getVideoFeed = (data, accessToken, nextPageToken, callback) => {
  if(data.uploadsId == 0) {
    var res = [];
    var completed_requests = 0;

    for(var i = 0; i < channels.length; i++) {
      if(channels[i].id != 0) {
        data.uploadsId = channels[i].id;
        getVideos(data, accessToken, null, (response) => {
          completed_requests++;
          res = res.concat(response);
          if(completed_requests == channels.length-1) {

            res.sort((a, b) => {
              a = new Date(a.date);
              b = new Date(b.date);
              return a > b ? -1 : a < b ? 1 : 0;
            });

            callback(res);
          }
        });
      }
    }
  } else {
    getVideos(data, accessToken, null, (response) => {
      callback(response);
    });
  }
}

const getVideos = (data, accessToken, nextPageToken, callback) => {
  var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + data.uploadsId + "&maxResults=25&pageToken=" + data.after;
  var headers = {
    "Authorization":"Bearer " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var res = [];
    for(var i = 0; i < json.items.length; i++){
      var video = {
        id: json.items[i].snippet.resourceId.videoId,
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
