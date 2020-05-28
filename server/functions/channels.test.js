const { Types } = require("mongoose");

const database = require("../utils/database");

const Channel = require("../models/channel");

const { getChannels, addChannels, deleteChannel } = require("./channels");

describe("Channels", () => {
	let channels = [];

	beforeAll(async () => {
		const connectionString = "mongodb://dedeco99:dedeco-00@entertainmenthub-shard-00-00-uzcnh.mongodb.net:27017,entertainmenthub-shard-00-01-uzcnh.mongodb.net:27017,entertainmenthub-shard-00-02-uzcnh.mongodb.net:27017/test?ssl=true&replicaSet=entertainmentHub-shard-0&authSource=admin&retryWrites=true&w=majority";
		await database.connect(connectionString);
	});

	afterAll(async () => {
		await database.disconnect();
	});

	describe("Add channels", () => {
		describe("With correct data", () => {
			const channelsToAdd = [
				{ channelId: "testId", displayName: "test", image: "testImage" },
				{ channelId: "testId2", displayName: "test2", image: "testImage2" },
			];
			let response = null;

			beforeAll(async () => {
				await Channel.deleteMany({});

				response = await addChannels({
					params: { platform: "youtube" },
					body: { channels: channelsToAdd },
					user: { _id: "507f1f77bcf86cd799439011" },
				});
			});

			it("returns 200", () => expect(response.status).toEqual(200));
			it("returns array of channels", () => {
				channels = response.body.data;

				expect(channels.length).toEqual(channelsToAdd.length);

				expect(channels[0].platform).toEqual("youtube");
				expect(channels[0].user).toEqual(Types.ObjectId("507f1f77bcf86cd799439011"));
				expect(channels[0].channelId).toEqual("testId");
				expect(channels[0].displayName).toEqual("test");
				expect(channels[0].image).toEqual("testImage");

				expect(channels[1].platform).toEqual("youtube");
				expect(channels[1].user).toEqual(Types.ObjectId("507f1f77bcf86cd799439011"));
				expect(channels[1].channelId).toEqual("testId2");
				expect(channels[1].displayName).toEqual("test2");
				expect(channels[1].image).toEqual("testImage2");
			});
		});

		describe("Empty array", () => {
			const channelsToAdd = [];
			let response = null;

			beforeAll(async () => {
				response = await addChannels({
					params: { platform: "youtube" },
					body: { channels: channelsToAdd },
					user: { _id: "507f1f77bcf86cd799439011" },
				});
			});

			it("returns 400", () => expect(response.status).toEqual(400));
		});
	});

	describe("Get channels", () => {
		let response = null;

		beforeAll(async () => {
			response = await getChannels({
				params: { platform: "youtube" },
				user: { _id: "507f1f77bcf86cd799439011" },
			});
		});

		it("returns 200", () => expect(response.status).toEqual(200));
		it("returns array of channels", () => {
			expect(response.body.data.length).toEqual(channels.length);
		});
	});

	describe("Delete channel", () => {
		describe("Channel exists", () => {
			let response = null;

			beforeAll(async () => {
				response = await deleteChannel({
					params: { id: channels[0]._id },
				});
			});

			it("returns 200", () => expect(response.status).toEqual(200));
			it("returns the deleted channel", () => {
				expect(response.body.data._id).toEqual(channels[0]._id);
			});
		});

		describe("Channel doesn't exist", () => {
			let response = null;

			beforeAll(async () => {
				response = await deleteChannel({
					params: { id: "507f1f77bcf86cd799439011" },
				});
			});

			it("returns 404", () => expect(response.status).toEqual(404));
		});

		describe("Channel id is not valid", () => {
			let response = null;

			beforeAll(async () => {
				response = await deleteChannel({
					params: { id: "badId" },
				});
			});

			it("returns 404", () => expect(response.status).toEqual(404));
		});
	});
});
