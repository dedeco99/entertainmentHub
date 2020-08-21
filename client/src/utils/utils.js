import moment from "moment";

function formatDate(date, format, relative, originalFormat) {
	if (relative) return moment(date).fromNow();

	return moment(date, originalFormat).format(format);
}

function formatVideoDuration(duration) {
	if (!duration || duration === "P0D") return "Live";

	const values = duration.substring(2).slice(0, -1).split(/[HM]/g);
	for (let i = 1; i < values.length; i++) {
		if (values[i].length < 2) values[i] = `0${values[i]}`;
	}

	return values.join(":");
}

function formatNotification(notification) {
	const { displayName, thumbnail, duration, videoTitle, episodeTitle, season, number } = notification.info;

	switch (notification.type) {
		case "youtube":
			return {
				thumbnail,
				overlay: duration,
				title: displayName,
				subtitle: videoTitle,
			};
		case "tv":
			const seasonLabel = season > 9 ? `S${season}` : `S0${season}`;
			const episodeLabel = number > 9 ? `E${number}` : `E0${number}`;

			return {
				thumbnail,
				overlay: `${seasonLabel}${episodeLabel}`,
				title: displayName,
				subtitle: `${seasonLabel}${episodeLabel} - ${episodeTitle}`,
			};
		default:
			return null;
	}
}

function htmlEscape(str) {
	return String(str)
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/<a/g, "<a target='_blank' rel='noopener noreferrer'")
		.replace(/<table/g, "<div style='overflow: auto'><table")
		.replace(/<\/table>/g, "</table></div>");
}

export { formatDate, formatVideoDuration, formatNotification, htmlEscape };
