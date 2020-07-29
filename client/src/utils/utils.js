import moment from "moment";

function formatDate(date, format, relative) {
	return relative ? moment(date).fromNow() : moment(date).format(format);
}

function formatVideoDuration(duration) {
	if (!duration || duration === "P0D") return "Live";

	const values = duration.substring(2).slice(0, -1).split(/[HM]/g);
	for (let i = 1; i < values.length; i++) {
		if (values[i].length < 2) values[i] = `0${values[i]}`;
	}

	return values.join(":");
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

export { formatDate, formatVideoDuration, htmlEscape };
