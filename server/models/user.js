const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		email: { type: String, default: "", unique: true },
		password: { type: String, default: "" },
		language: { type: String, default: "en" },
		settings: {
			currency: { type: String, default: "EUR" },
			useCustomScrollbar: { type: Boolean, default: false },
			animations: { type: Boolean, default: true },
			borderColor: { type: Boolean, default: false },
			autoplayVideoPlayer: { type: Boolean, default: false },
			youtube: {
				watchLaterPlaylist: { type: String },
			},
			tv: {
				hideEpisodesThumbnails: { type: Boolean, default: true },
			},
			appHints: { type: Boolean, default: true },
		},
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const User = model("User", UserSchema);

module.exports = User;
