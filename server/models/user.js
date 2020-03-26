const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, default: "", unique: true },
	password: { type: String, default: "" },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const User = mongoose.model("User", UserSchema);

module.exports = User;
