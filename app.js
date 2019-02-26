const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
if(!process.env.PORT) var secrets=require("./secrets");
const database = require('./database');
const reddit = require('./reddit');

database.setup();

const app = express();

app.set("port",(process.env.PORT || 5000));

exports.server=app.listen(app.get("port"),function(){
  console.log("Node app is running on port",app.get("port"));
});

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(cookieParser());

app.get("/api/reddit/subreddits",reddit.getSubreddits);

app.get("/api/reddit/subreddits/:subreddit/:category/",reddit.getPosts);

app.get('*/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
});
