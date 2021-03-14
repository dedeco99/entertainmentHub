import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function formatDate(date, format, relative, originalFormat) {
	return relative ? dayjs(date).fromNow() : dayjs(date, originalFormat).format(format);
}

function formatNumber(number) {
	return number.toString().replace(/(.)(?=(\d{3})+$)/g, "$1 ");
}

function formatVideoDuration(duration) {
	if (!duration || duration === "P0D") return "Live";

	const hasHours = duration.includes("H");
	const hasMinutes = duration.includes("M");
	const hasSeconds = duration.includes("S");

	const values = duration.substring(2).slice(0, -1).split(/[HM]/g);
	for (let i = 1; i < values.length; i++) {
		if (values[i].length < 2) values[i] = `0${values[i]}`;
	}

	if (hasHours) {
		if (!hasMinutes) values.push("00");
		if (!hasSeconds) values.push("00");
	} else if (hasMinutes && !hasSeconds) {
		values.push("00");
	} else if (hasSeconds && !hasMinutes) {
		values.unshift("00");
	}

	return values.join(":");
}

function formatNotification(notification) {
	const {
		displayName,
		thumbnail,
		duration,
		videoTitle,
		episodeTitle,
		season,
		number,
		reminder,
	} = notification.info;

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
		case "reminder":
			return {
				title: reminder,
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

export { formatDate, formatNumber, formatVideoDuration, formatNotification, htmlEscape };
