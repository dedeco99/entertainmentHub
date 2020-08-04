const { Types } = require("mongoose");

const database = require("../utils/database");

const Subscription = require("../models/subscription");

const { getSubscriptions, addSubscriptions, deleteSubscription } = require("./subscriptions");

describe("Subscriptions", () => {
	let subscriptions = [];

	beforeAll(async () => {
		const connectionString =
			"mongodb://dedeco99:dedeco-00@entertainmenthub-shard-00-00-uzcnh.mongodb.net:27017,entertainmenthub-shard-00-01-uzcnh.mongodb.net:27017,entertainmenthub-shard-00-02-uzcnh.mongodb.net:27017/test?ssl=true&replicaSet=entertainmentHub-shard-0&authSource=admin&retryWrites=true&w=majority";
		await database.connect(connectionString);
	});

	afterAll(async () => {
		await database.disconnect();
	});

	describe("Add subscriptions", () => {
		describe("With correct data", () => {
			const subscriptionsToAdd = [
				{ externalId: "testId", displayName: "test", image: "testImage" },
				{ externalId: "testId2", displayName: "test2", image: "testImage2" },
			];
			let response = null;

			beforeAll(async () => {
				await Subscription.deleteMany({});

				response = await addSubscriptions({
					params: { platform: "youtube" },
					body: { subscriptions: subscriptionsToAdd },
					user: { _id: "507f1f77bcf86cd799439011" },
				});
			});

			it("returns 201", () => expect(response.status).toEqual(201));
			it("returns array of subscriptions", () => {
				subscriptions = response.body.data;

				expect(subscriptions.length).toEqual(subscriptionsToAdd.length);

				expect(subscriptions[0].platform).toEqual("youtube");
				expect(subscriptions[0].user).toEqual(Types.ObjectId("507f1f77bcf86cd799439011"));
				expect(subscriptions[0].externalId).toEqual("testId");
				expect(subscriptions[0].displayName).toEqual("test");
				expect(subscriptions[0].image).toEqual("testImage");

				expect(subscriptions[1].platform).toEqual("youtube");
				expect(subscriptions[1].user).toEqual(Types.ObjectId("507f1f77bcf86cd799439011"));
				expect(subscriptions[1].externalId).toEqual("testId2");
				expect(subscriptions[1].displayName).toEqual("test2");
				expect(subscriptions[1].image).toEqual("testImage2");
			});
		});

		describe("Empty array", () => {
			const subscriptionsToAdd = [];
			let response = null;

			beforeAll(async () => {
				response = await addSubscriptions({
					params: { platform: "youtube" },
					body: { subscriptions: subscriptionsToAdd },
					user: { _id: "507f1f77bcf86cd799439011" },
				});
			});

			it("returns 400", () => expect(response.status).toEqual(400));
		});
	});

	describe("Get subscriptions", () => {
		let response = null;

		beforeAll(async () => {
			response = await getSubscriptions({
				params: { platform: "youtube" },
				user: { _id: "507f1f77bcf86cd799439011" },
			});
		});

		it("returns 200", () => expect(response.status).toEqual(200));
		it("returns array of subscriptions", () => {
			expect(response.body.data.length).toEqual(subscriptions.length);
		});
	});

	describe("Delete subscription", () => {
		describe("Subscription exists", () => {
			let response = null;

			beforeAll(async () => {
				response = await deleteSubscription({
					params: { id: subscriptions[0]._id },
				});
			});

			it("returns 200", () => expect(response.status).toEqual(200));
			it("returns the deleted subscription", () => {
				expect(response.body.data._id).toEqual(subscriptions[0]._id);
			});
		});

		describe("Subscription doesn't exist", () => {
			let response = null;

			beforeAll(async () => {
				response = await deleteSubscription({
					params: { id: "507f1f77bcf86cd799439011" },
				});
			});

			it("returns 404", () => expect(response.status).toEqual(404));
		});

		describe("Subscription id is not valid", () => {
			let response = null;

			beforeAll(async () => {
				response = await deleteSubscription({
					params: { id: "badId" },
				});
			});

			it("returns 404", () => expect(response.status).toEqual(404));
		});
	});
});
