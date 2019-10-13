/*const request = require("request");

const database = require("./database");

exports.getStreams = (req, res) => {
  var data = { userId: req.query.userId };

  getAccessToken(data, getStreams, (response) => {
    res.json(response);
  });
}

exports.getChannels = (req, res) => {
  var data = { userId: req.query.userId };

  getAccessToken(data, getChannels, (response) => {
    res.json(response);
  });
}

exports.getGames = (req, res) => {
  var data = { userId: req.query.userId };

  getAccessToken(data, getFollowedGames, (response) => {
    getTopGames(data, response, (response) => {
      res.json(response);
    });
  });
}

exports.getStreamsForGame = (req, res) => {
  var data = {
    userId: req.query.userId,
    game: req.params.game
  };

  getStreamsForGame(data, (response) => {
    res.json(response);
  });
}

const getAccessToken = (data, run, callback) => {
  database.firestore.collection("auths")
  .where("user", "==", data.userId)
  .where("platform", "==", "twitch")
  .get().then((snapshot) => {
    if(snapshot.size > 0){
      var url="https://api.twitch.tv/kraken/oauth2/token"
              +"?client_id=" + process.env.twitchClientId
              +"&client_secret=" + process.env.twitchSecret
              +"&refresh_token=" + snapshot.docs[0].data().refreshToken
              +"&grant_type=refresh_token";

      request.post(url, (error, response, html) => {
        if(error) console.log(error);
        var json = JSON.parse(html);

        run(data, json.access_token, callback);
      });
    }
  });
}

const getStreams = (data, accessToken, callback) => {
  var offset = data.after;
  var url = "https://api.twitch.tv/kraken/streams/followed?limit=50";
  var headers = {
    "Accept": "application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.twitchClientId,
    "Authorization": "OAuth " + accessToken
  };

  if(offset != null) url += "&offset=" + offset;

  request({ url: url,headers: headers }, (error, response, html) =>{
    if(error) console.log(error);
    var json = JSON.parse(html);
    offset = +offset + +50;

    var res = [];
    for(var i = 0; i < json.streams.length; i++){
      var stream = {
        id: json.streams[i]._id,
        displayName: json.streams[i].channel.display_name.charAt(0).toUpperCase() + json.streams[i].channel.display_name.slice(1),
        name: json.streams[i].channel.name,
        logo: json.streams[i].channel.logo,
        live: true,
        streamName: json.streams[i].channel.status,
        preview: json.streams[i].preview.large,
        game: json.streams[i].game,
        viewers: json.streams[i].viewers,
        dateStarted: json.streams[i].created_at,
        after: offset
      };
      res.push(stream);
    }
    res.sort((a, b) => {
      if(a.viewers < b.viewers) return 1;
      if(a.viewers > b.viewers) return -1;
      return 0;
    });
    callback(res);
  });
}

const getChannels = (data, accessToken, callback) => {
  var offset = data.after;
  var url = "https://api.twitch.tv/kraken/user";
  var headers = {
    "Accept":"application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.twitchClientId,
    "Authorization":"OAuth " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var url = "https://api.twitch.tv/kraken/users/" + json._id + "/follows/channels?limit=50";
    var headers = {
      "Accept":"application/vnd.twitchtv.v5+json",
      "Client-ID": process.env.twitchClientId,
      "Authorization":"OAuth " + json.access_token
    };

    if(offset) url += "&offset=" + offset;

    request({ url: url,headers: headers }, (error, response, html) => {
      if(error) console.log(error);
      var json = JSON.parse(html);
      offset = +offset + +50;

      var res = [];
      for(var i = 0; i < json.follows.length; i++){
        var banner = "assets/img/noimage.png";
        if(json.follows[i].channel.video_banner){
          banner = json.follows[i].channel.video_banner;
        }
        var stream = {
          displayName: json.follows[i].channel.display_name.charAt(0).toUpperCase() + json.follows[i].channel.display_name.slice(1),
          name: json.follows[i].channel.name,
          logo: json.follows[i].channel.logo,
          background: banner,
          views: json.follows[i].channel.views,
          followers: json.follows[i].channel.followers,
          after: offset
        };
        res.push(stream);

        //if(streams.filter(function(e){return e.name==stream.name;}).length==0){
          //res.push(stream);
        //}
      }
      callback(res);
    });
  });
}

const getHosts = (data, accessToken, callback) => {
  var url = "https://api.twitch.tv/kraken/hosting/followed";
  var headers = {
    "Accept":"application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.twitchClientId,
    "Authorization":"OAuth " + accessToken
  };

  request({ url: url, headers: headers}, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var res = [];
    for(var i = 0; i < json.streams.length; i++){
      var stream = {
        displayName: json.streams[i].channel.display_name.charAt(0).toUpperCase() + json.streams[i].channel.display_name.slice(1),
        name: json.streams[i].channel.name,
        logo: json.streams[i].channel.logo,
        live: true
      };
      res.push(stream);
    }
    socket.emit("getChannels",res.sort(
      function(a,b){
        if(a.displayName<b.displayName) return -1;
        if(a.displayName>b.displayName) return 1;
        return 0;
      }
    ));
  });
}

const getTopGames = (data, res, callback) => {
  var offset = data.after;
  var url = "https://api.twitch.tv/kraken/games/top?limit=50";
  var headers = {
    "Accept": "application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.twitchClientId
  };

  if(offset != null) url += "&offset=" + offset;

  request({ url: url, headers: headers}, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);
    offset = +offset + +50;

    for(var i = 0; i < json.top.length; i++){
      var name = json.top[i].game.name.replace("'", "&#39;");
      var game = {
        id: json.top[i].game._id,
        name: name,
        logo: json.top[i].game.box.large,
        channels: json.top[i].channels,
        viewers: json.top[i].viewers,
        after: offset,
        followed: false
      };
      res.push(game);
    }
    callback(res);
  });
}

const getFollowedGames = (data, accessToken, callback) => {
  var offset = data.after;
  var url = "https://api.twitch.tv/kraken/user";
  var headers = {
    "Accept": "application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.twitchClientId,
    "Authorization": "OAuth " + accessToken
  };

  request({ url: url, headers: headers }, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var url = "https://api.twitch.tv/kraken/users/" + json._id + "/follows/games?limit=50";
    var headers = {
      "Accept": "application/vnd.twitchtv.v5+json",
      "Client-ID": process.env.twitchClientId,
      "Authorization": "OAuth " + json.access_token
    };

    if(offset) url += "&offset=" + offset;

    request({ url: url, headers: headers }, (error, response, html) => {
      if(error) console.log(error);
      var json = JSON.parse(html);
      offset = +offset + +50;

      var res = [];
      for(var i = 0; i < json.follows.length; i++){
        var name = json.follows[i].game.name.replace("'", "&#39;");
        var game = {
          id: json.follows[i].game._id,
          name: name,
          logo: json.follows[i].game.box.large,
          channels: json.follows[i].channels,
          viewers: json.follows[i].viewers,
          after: offset,
          followed: true
        };
        res.push(game);
      }
      callback(res);
    });
  });
}

const getStreamsForGame = (data, callback) => {
  var offset = data.after;
  var url = "https://api.twitch.tv/kraken/streams?game=" + data.game + "&limit=50";
  var headers = {
    "Accept": "application/vnd.twitchtv.v5+json",
    "Client-ID": process.env.twitchClientId
  };

  if(offset != null) url += "&offset=" + offset;

  request({ url: url, headers: headers}, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);
    offset = +offset + +50;

    var res = [];
    for(var i = 0; i < json.streams.length; i++){
      var stream = {
        id: json.streams[i]._id,
        displayName: json.streams[i].channel.display_name.charAt(0).toUpperCase() + json.streams[i].channel.display_name.slice(1),
        name: json.streams[i].channel.name,
        logo: json.streams[i].channel.logo,
        live: true,
        streamName: json.streams[i].channel.status,
        preview: json.streams[i].preview.large,
        game: json.streams[i].game,
        viewers: json.streams[i].viewers,
        dateStarted: json.streams[i].created_at,
        after: offset
      };
      res.push(stream);
    }
    res.sort((a,b) => {
      if(a.viewers < b.viewers) return 1;
      if(a.viewers > b.viewers) return -1;
      return 0;
    });
    callback(res);
  });
}
*/
