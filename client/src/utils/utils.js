import moment from "moment";

function formatDate(date, format, relative) {
	return relative ? moment(date).fromNow() : moment(date).format(format);
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

export { formatDate, htmlEscape };
