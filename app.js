const express = require("express");
const path = require("path");
const morgan = require("morgan");
const socketio = require("socket.io");
const cron = require("node-cron");

const { initialize } = require("./server/utils/database");
const { formatDate } = require("./server/utils/utils");
const auth = require("./server/auth");
const apps = require("./server/apps");
const users = require("./server/users");
const widgets = require("./server/widgets");
const notifications = require("./server/notifications");
const weather = require("./server/weather");
const crypto = require("./server/crypto");
const reddit = require("./server/reddit");
const youtube = require("./server/youtube");
// const twitch = require("./server/twitch");
const tv = require("./server/tv");

global.sockets = [];
global.cache = {
	crypto: {
		data: {},
		coins: [],
		lastUpdate: Date.now(),
	},
};

// eslint-disable-next-line global-require
if (!process.env.ENV) require("./server/secrets");

initialize();

const app = express();

app.set("port", process.env.PORT || 5000);

morgan.token("date", () => formatDate(Date.now(), "hh:mm:ss"));

app.use(morgan(
	":date :status :method :url :response-time ms",
	{ skip: req => req.originalUrl.includes(".css") || req.originalUrl.includes(".ico") },
));

app.use(express.static(path.join(__dirname, "client/build")));

// Body parser
app.use(express.json());

app.post("/api/auth/register", auth.register);

app.post("/api/auth/login", auth.login);

app.get("/api/apps", apps.getApps);

app.post("/api/apps", apps.addApp);

app.delete("/api/apps/:id", apps.deleteApp);

app.put("/api/users", users.editUser);

app.get("/api/widgets", widgets.getWidgets);

app.post("/api/widgets", widgets.addWidget);

app.put("/api/widgets/:id", widgets.editWidget);

app.delete("/api/widgets/:id", widgets.deleteWidget);

app.get("/api/notifications", notifications.getNotifications);

app.patch("/api/notifications/:id", notifications.patchNotification);

app.delete("/api/notifications/:id", notifications.deleteNotification);

app.get("/api/weather/:lat/:lon", weather.getWeather);

app.get("/api/weather/cities", weather.getCities);

app.get("/api/crypto", crypto.getCoins);

app.get("/api/crypto/:coins", crypto.getPrices);

app.get("/api/reddit", reddit.getSubreddits);

app.get("/api/reddit/:subreddit/:category", reddit.getPosts);

app.get("/api/reddit/:subreddit/search/:search", reddit.getSearch);

app.get("/api/youtube/subscriptions", youtube.getSubscriptions);

app.get("/api/youtube/channels", youtube.getChannels);

app.post("/api/youtube/channels", youtube.addChannels);

app.delete("/api/youtube/channels/:id", youtube.deleteChannel);

/*
app.get("/api/youtube/channels/:channel/", youtube.getPosts);

app.get("/api/twitch/streams/", twitch.getStreams);

app.get("/api/twitch/games/", twitch.getGames);

app.get("/api/twitch/games/:game", twitch.getStreamsForGame);

app.get("/api/twitch/channels/", twitch.getChannels);
*/

app.get("/api/tv", tv.getSeries);

app.post("/api/tv", tv.addSeries);

app.put("/api/tv/:id", tv.editSeries);

app.delete("/api/tv/:id", tv.deleteSeries);

app.get("/api/tv/search/:search", tv.getSearch);

app.get("/api/tv/popular", tv.getPopular);

app.get("/api/tv/:id", tv.getEpisodes);

app.get("*/", (req, res) => {
	res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const server = app.listen(app.get("port"), () => {
	console.log("Node app is running on port", app.get("port"));
});

const io = socketio(server, { origins: "*:*", transports: ["websocket"] });
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
