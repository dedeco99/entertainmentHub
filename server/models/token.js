const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	token: { type: String, default: null, unique: true },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Token = model("Token", TokenSchema);

module.exports = Token;
