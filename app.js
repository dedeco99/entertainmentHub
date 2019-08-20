const express = require("express");
const path = require("path");

const database = require("./server/database");
const auth = require("./server/auth");
const reddit = require("./server/reddit");
const youtube = require("./server/youtube");
const twitch = require("./server/twitch");
const tvSeries = require("./server/tvSeries");

require("./server/secrets");

database.initialize();

const app = express();

app.set("port", process.env.PORT || 5000);

app.use(express.static(path.join(__dirname, "client/build")));

// Body parser
app.use(express.json());

app.post("/api/auth/register/", auth.register);

app.post("/api/auth/login/", auth.login);

app.get("/api/auth/validate/:token", auth.validateToken);

app.get("/api/reddit/subreddits/", reddit.getSubreddits);

app.get("/api/reddit/subreddits/:subreddit/:category/", reddit.getPosts);

app.get("/api/youtube/channels/", youtube.getChannels);

app.get("/api/youtube/channels/:channel/", youtube.getPosts);

app.get("/api/twitch/streams/", twitch.getStreams);

app.get("/api/twitch/games/", twitch.getGames);

app.get("/api/twitch/games/:game", twitch.getStreamsForGame);

app.get("/api/twitch/channels/", twitch.getChannels);

app.get("/api/tvSeries/:tvSeries/seasons", tvSeries.getSeasons);

app.get("/api/tvSeries/:tvSeries/seasons/:season/episodes", tvSeries.getEpisodes);

app.get("/api/tvSeries/search/:search", tvSeries.getSearch);

app.get("*/", (req, res) => {
	res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

exports.server = app.listen(app.get("port"), () => {
	console.log("Node app is running on port", app.get("port"));
});
