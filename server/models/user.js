const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
	email: { type: String, default: "", unique: true },
	password: { type: String, default: "" },
	settings: {
		useCustomScrollbar: { type: Boolean, default: false },
	},
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const User = model("User", UserSchema);

module.exports = User;
