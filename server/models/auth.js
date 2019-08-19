const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	platform: { type: String, default: "" },
	refreshToken: { type: String, default: "" }
});

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
