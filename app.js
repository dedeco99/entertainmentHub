const path = require("path");
const express = require("express");

if(!process.env.PORT) var secrets=require("./server/secrets");
const database = require("./server/database");
const reddit = require("./server/reddit");
const youtube = require("./server/youtube");

database.initialize();

const app = express();

app.set("port",(process.env.PORT || 5000));

exports.server=app.listen(app.get("port"),function(){
  console.log("Node app is running on port",app.get("port"));
});

app.use(express.static(path.join(__dirname, "client/build")))

app.get("/api/reddit/subreddits/",reddit.getSubreddits);

app.get("/api/reddit/subreddits/:subreddit/:category/",reddit.getPosts);

app.get("/api/youtube/channels/",youtube.getChannels);

app.get("/api/youtube/channels/:channel/",youtube.getPosts);

app.get("*/", function (req, res) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
});
