const path = require("path");
const express = require("express");

if(!process.env.PORT) var secrets=require("./server/secrets");
const database = require("./server/database");
const reddit = require("./server/reddit");
const youtube = require("./server/youtube");
const twitch = require("./server/twitch");
const tvSeries = require("./server/tvSeries");

database.initialize();

const app = express();

app.set("port",(process.env.PORT || 5000));

exports.server=app.listen(app.get("port"),function(){
  console.log("Node app is running on port",app.get("port"));
});

app.use(express.static(path.join(__dirname, "client/build")))

app.get("/api/reddit/subreddits/", reddit.getSubreddits);

app.get("/api/reddit/subreddits/:subreddit/:category/", reddit.getPosts);

app.get("/api/youtube/channels/", youtube.getChannels);

app.get("/api/youtube/channels/:channel/", youtube.getPosts);

app.get("/api/twitch/streams/", twitch.getStreams);

app.get("/api/twitch/games/", twitch.getGames);

app.get("/api/twitch/games/:game", twitch.getStreamsForGame);

app.get("/api/twitch/channels/", twitch.getChannels);

app.get("/api/tvSeries/search/:search", tvSeries.getSearch);

app.get("*/", function (req, res) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
});
