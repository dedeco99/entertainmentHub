import moment from "moment";

function formatDate(date, format, relative) {
	return relative ? moment(date).fromNow() : moment(date).format(format);
}

export {
	formatDate,
};
