const { Schema, model } = require("mongoose");

const AppSchema = new Schema({
	user: { type: Schema.ObjectId, ref: "User" },
	platform: { type: String, default: "" },
	refreshToken: { type: String, default: "" },
}, { timestamps: { createdAt: "_created", updatedAt: "_modified" } });

const App = model("App", AppSchema);

module.exports = App;
