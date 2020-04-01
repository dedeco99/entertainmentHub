import moment from "moment";

function formatDate(date, format) {
	return moment(date).format(format);
}

export {
	formatDate,
};
