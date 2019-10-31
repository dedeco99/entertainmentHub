const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	token: { type: String, default: null, unique: true },
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;