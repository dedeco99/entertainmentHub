const { Schema, model } = require("mongoose");

const ChannelGroupSchema = new Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: true },
		platform: { type: String, required: true },
		displayName: { type: String, default: "", required: true },
		channels: [{ type: String }],
		x: { type: Number, default: 0 },
		y: { type: Number, default: 0 },
		width: { type: Number, default: null },
		height: { type: Number, default: null },
	},
	{ timestamps: { createdAt: "_created", updatedAt: "_modified" } },
);

const ChannelGroup = model("ChannelGroup", ChannelGroupSchema);

module.exports = ChannelGroup;