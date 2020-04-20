const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	channelId: { type: String, default: "" },
	displayName: { type: String, default: "" },
	image: { type: String, default: "" },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
