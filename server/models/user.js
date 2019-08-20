const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, default: "" },
	password: { type: String, default: "" }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
