import moment from "moment";

function formatDate(date, format, relative) {
	return relative ? moment(date).fromNow() : moment(date).format(format);
}

function parseQuery(queryString) {
	const query = {};
	const pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
	if (pairs[0] !== "") {
		for (let i = 0; i < pairs.length; i++) {
			const pair = pairs[i].split("=");
			query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
		}
	}
	return query;
}

function stringifyQuery(queryObject) {
	return new URLSearchParams(queryObject).toString();
}

export {
	formatDate,
	parseQuery,
	stringifyQuery,
};
