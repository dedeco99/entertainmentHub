const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		email: { type: String, default: "", unique: true },
		password: { type: String, default: "" },
		language: { type: String, default: "en" },
		settings: {
			useCustomScrollbar: { type: Boolean, default: false },
			animations: { type: Boolean, default: true },
			borderColor: { type: Boolean, default: false },
			youtube: {
				watchLaterPlaylist: { type: String },
			},
			hideThumbnailEpisodes: { type: Boolean, default: false },
		},
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const User = model("User", UserSchema);

module.exports = User;
