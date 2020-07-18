const express = require("express");
const path = require("path");
const morgan = require("morgan");
const socketio = require("socket.io");
const cron = require("node-cron");

const database = require("./utils/database");
const { token, middleware } = require("./utils/middleware");
const { formatDate } = require("./utils/utils");

const auth = require("./functions/auth");
const apps = require("./functions/apps");
const users = require("./functions/users");
const widgets = require("./functions/widgets");
const notifications = require("./functions/notifications");
const weather = require("./functions/weather");
const crypto = require("./functions/crypto");
const reddit = require("./functions/reddit");
const channels = require("./functions/channels");
const channelGroups = require("./functions/channelGroups");
const youtube = require("./functions/youtube");
const twitch = require("./functions/twitch");
const tv = require("./functions/tv");

global.sockets = [];
global.cache = {
	crypto: {
		data: {},
		coins: [],
		lastUpdate: Date.now(),
	},
};

if (!process.env.ENV) require("./utils/secrets");

database.connect(process.env.databaseConnectionString);

const app = express();

app.set("port", process.env.PORT || 5000);

morgan.token("date", () => formatDate(Date.now(), "hh:mm:ss"));

app.use(morgan(
	":date :status :method :url :response-time ms",
	{ skip: req => req.originalUrl.includes(".css") || req.originalUrl.includes(".ico") },
));

app.use(express.static(path.join(__dirname, "build")));

// Body parser
app.use(express.json());

app.post("/api/auth/register", (req, res) => middleware(req, res, auth.register));

app.post("/api/auth/login", (req, res) => middleware(req, res, auth.login));

app.get("/api/apps", token, (req, res) => middleware(req, res, apps.getApps));

app.post("/api/apps", token, (req, res) => middleware(req, res, apps.addApp));

app.delete("/api/apps/:id", token, (req, res) => middleware(req, res, apps.deleteApp));

app.put("/api/users", token, (req, res) => middleware(req, res, users.editUser));

app.get("/api/widgets", token, (req, res) => middleware(req, res, widgets.getWidgets));

app.post("/api/widgets", token, (req, res) => middleware(req, res, widgets.addWidget));

app.put("/api/widgets/:id", token, (req, res) => middleware(req, res, widgets.editWidget));

app.delete("/api/widgets/:id", token, (req, res) => middleware(req, res, widgets.deleteWidget));

app.get("/api/notifications", token, (req, res) => middleware(req, res, notifications.getNotifications));

app.patch("/api/notifications/:id", token, (req, res) => middleware(req, res, notifications.patchNotification));

app.delete("/api/notifications/:id", token, (req, res) => middleware(req, res, notifications.deleteNotification));

app.get("/api/weather/:lat/:lon", (req, res) => middleware(req, res, weather.getWeather));

app.get("/api/weather/cities", token, (req, res) => middleware(req, res, weather.getCities));

app.get("/api/crypto", token, (req, res) => middleware(req, res, crypto.getCoins));

app.get("/api/crypto/:coins", token, (req, res) => middleware(req, res, crypto.getPrices));

app.get("/api/reddit", token, (req, res) => middleware(req, res, reddit.getSubreddits));

app.get("/api/reddit/:subreddit/:category", token, (req, res) => middleware(req, res, reddit.getPosts));

app.get("/api/reddit/:subreddit/search/:search", token, (req, res) => middleware(req, res, reddit.getSearch));

app.get("/api/channels/:platform", token, (req, res) => middleware(req, res, channels.getChannels));

app.post("/api/channels/:platform", token, (req, res) => middleware(req, res, channels.addChannels));

app.delete("/api/channels/:id", token, (req, res) => middleware(req, res, channels.deleteChannel));

app.get("/api/channelgroups/:platform", token, (req, res) => middleware(req, res, channelGroups.getChannelGroups));

app.post("/api/channelgroups/:platform", token, (req, res) => middleware(req, res, channelGroups.addChannelGroup));

app.put("/api/channelgroups/:id", token, (req, res) => middleware(req, res, channelGroups.editChannelGroup));

app.delete("/api/channelgroups/:id", token, (req, res) => middleware(req, res, channelGroups.deleteChannelGroup));

app.get("/api/youtube/subscriptions", token, (req, res) => middleware(req, res, youtube.getSubscriptions));

app.post("/api/youtube/watchlater/:id", token, (req, res) => middleware(req, res, youtube.addToWatchLater));

// app.get("/api/youtube/channels/:channel/", token, (req, res) => middleware(req, res, youtube.getPosts));

app.get("/api/twitch/streams", token, (req, res) => middleware(req, res, twitch.getStreams));

app.get("/api/twitch/follows", token, (req, res) => middleware(req, res, twitch.getFollows));

/*
app.get("/api/twitch/games/", token, (req, res) => middleware(req, res, twitch.getGames));

app.get("/api/twitch/games/:game", token, (req, res) => middleware(req, res, twitch.getStreamsForGame));

app.get("/api/twitch/channels/", token, (req, res) => middleware(req, res, twitch.getChannels));
*/

app.get("/api/tv", token, (req, res) => middleware(req, res, tv.getSeries));

app.post("/api/tv", token, (req, res) => middleware(req, res, tv.addSeries));

app.put("/api/tv/:id", token, (req, res) => middleware(req, res, tv.editSeries));

app.delete("/api/tv/:id", token, (req, res) => middleware(req, res, tv.deleteSeries));

app.get("/api/tv/search/:search", token, (req, res) => middleware(req, res, tv.getSearch));

app.get("/api/tv/popular", token, (req, res) => middleware(req, res, tv.getPopular));

app.get("/api/tv/:id", token, (req, res) => middleware(req, res, tv.getEpisodes));

app.get("*/", (req, res) => {
	res.sendFile(path.join(`${__dirname}/build/index.html`));
});

const server = app.listen(app.get("port"), () => {
	console.log("Listening on port", app.get("port"));
});

const io = socketio(server, { transports: ["websocket"] });
io.sockets.on("connection", socket => {
	console.log("Connected", socket.id);

	socket.on("bind", user => {
		if (user) {
			if (global.sockets[user._id]) {
				global.sockets[user._id].push(socket);
			} else {
				global.sockets[user._id] = [socket];
			}
		}
	});

	/*
	socket.on("typing", data => {
		socket.broadcast.emit("typing", data);
	});
	*/

	socket.on("disconnect", () => {
		for (const user in global.sockets) {
			global.sockets[user] = global.sockets[user].filter(s => !s.disconnected);
			console.log("Disconnected", socket.id);
		}
	});
});

if (process.env.ENV === "prod") {
	cron.schedule("0,30 * * * *", () => {
		notifications.cronjob();
		youtube.cronjob();
	});

	cron.schedule("0 0,8,16 * * *", () => {
		tv.cronjob();
	});

	console.log("Cronjobs are running");
}
