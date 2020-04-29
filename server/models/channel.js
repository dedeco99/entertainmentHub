const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User", required: true },
	platform: { type: String, required: true },
	channelId: { type: String, default: "", required: true },
	displayName: { type: String, default: "", required: true },
	image: { type: String, default: "" },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
