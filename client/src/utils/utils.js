import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

import { RedditContext } from "../contexts/RedditContext";
import { YoutubeContext } from "../contexts/YoutubeContext";
import { TwitchContext } from "../contexts/TwitchContext";
import { TVContext } from "../contexts/TVContext";

function formatDate(date, format, relative, originalFormat) {
	return relative ? dayjs(date).fromNow() : dayjs(date, originalFormat).format(format);
}

function diff(date, unit) {
	return dayjs().diff(dayjs(date), unit);
}

function formatNumber(number) {
	return number.toString().replace(/(.)(?=(\d{3})+$)/g, "$1 ");
}

function getCurrencySymbol(currency) {
	switch (currency) {
		case "EUR":
			return "€";
		case "USD":
			return "$";
		case "GBP":
			return "£";
		default:
			return "";
	}
}

// eslint-disable-next-line complexity
function formatVideoDuration(duration) {
	if (!duration || duration === "P0D") return "Live";

	const formattedDuration = duration.replace("PT", "").toLowerCase();

	const hasHours = formattedDuration.includes("h");
	const hasMinutes = formattedDuration.includes("m");
	const hasSeconds = formattedDuration.includes("s");

	const values = formattedDuration.split(/[hms]/g).filter(d => d);

	if (values[0] === "60") return "1:00";

	if (!hasHours && !hasMinutes && values[0].length < 2) values[0] = `0${values[0]}`;

	for (let i = 1; i < values.length; i++) {
		if (values[i].length < 2) values[i] = `0${values[i]}`;
	}

	if (hasHours) {
		if (!hasMinutes) values.push("00");
		if (!hasSeconds) values.push("00");
	} else if (hasMinutes && !hasSeconds) {
		values.push("00");
	} else if (hasSeconds && !hasMinutes) {
		values.unshift("0");
	}

	return values.join(":");
}

function formatNotification(notification) {
	const { displayName, thumbnail, duration, videoTitle, episodeTitle, season, number, reminder } =
		notification.info;

	switch (notification.type) {
		case "youtube":
			return {
				thumbnail,
				overlay: formatVideoDuration(duration),
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
				episodeNumber: number,
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

function getField(obj, path) {
	return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

function groupOptions(array, key) {
	return array.reduce((acc, curr) => {
		(acc[getField(curr, key)] = acc[getField(curr, key)] || []).push(curr);
		return acc;
	}, {});
}

function groupOptionsArray(array) {
	const grouped = [];
	for (const elem of array) {
		const groupExists = grouped.find(g => g.name === elem.group.name);

		if (groupExists) {
			groupExists.list.push(elem);
		} else {
			grouped.push({ name: elem.group.name, pos: elem.group.pos, list: [elem] });
		}
	}

	return grouped;
}

function chooseContext(platform) {
	switch (platform) {
		case "reddit":
			return RedditContext;
		case "youtube":
			return YoutubeContext;
		case "twitch":
			return TwitchContext;
		case "tv":
			return TVContext;
		default:
			return null;
	}
}

export {
	formatDate,
	diff,
	formatNumber,
	getCurrencySymbol,
	formatVideoDuration,
	formatNotification,
	htmlEscape,
	getField,
	groupOptions,
	groupOptionsArray,
	chooseContext,
};
