import { ApolloServer } from '@apollo/server';
import { after, before, beforeEach, describe, it } from "node:test";
import { ChatterType, NewChatterType } from "../chatterTypes";
import supertest from "supertest";
import assert from "node:assert";
import mongoose from "mongoose";
import createApp from "../app";
import TestAgent from "supertest/lib/agent";
import Test from "supertest/lib/test";

describe("Chatter Test", () => {
	let api: TestAgent<Test>;
	let gqServer: ApolloServer<ChatterType>
	before(async () => {
		let { app, apolloServer } = await createApp();
		gqServer = apolloServer
		api = supertest(app)

	})
	describe("Unauthorized routes", () => {
		const chatterDetails: NewChatterType[] = [
			{
				username: "test1",
				password: "atleast8",
				displayName: "Test1",
				email: "test1@mail.com",
			},
			{
				username: "test2",
				password: "atleast8",
				displayName: "Test1",
				email: "test2@mail.com",
			},
			{
				username: "test3",
				password: "atleast8",
				displayName: "Test3",
				email: "test3@mail.com",
			},
			{
				username: "test4",
				password: "atleast8",
				displayName: "Test4",
				email: "test4@mail.com",
			},
			{
				username: "test5",
				password: "atleast8",
				displayName: "Test5",
				email: "test5@mail.com",
			},
			{
				username: "test6",
				password: "atleast8",
				displayName: "Test6",
				email: "test6@mail.com",
			},
		];
		beforeEach(async () => {
			await api.post("/api/test/resetChatter");
		});
		describe("Registering a new Chatter", () => {
			it("Status 201 is sent on register", async () => {
				await api
					.post("/api/chatter/register")
					.send(chatterDetails[0])
					.expect(201);

			});
			describe("Missing or invalid Arguments send status 422", () => {
				let chatter: Partial<NewChatterType> = {};
				it("Missing all", async () => {
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
				it("Only  username", async () => {
					chatter.username = "atleast4";
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
				it("Only username and password", async () => {
					chatter.password = "atleast8";
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
				it("Username shorter than 4", async () => {
					chatter.username = "cup";
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
				it("Password shorter than 8", async () => {
					chatter.username = "atleast4";
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
				it("Username longer than 16", async () => {
					chatter.username = "Well time to pull";
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
				it("Password is longer than 64", async () => {
					chatter.username = "atleast4";
					chatter.password =
						"his time it should be very long at the very least 64 letters long";
					await api.post("/api/chatter/register").send(chatter).expect(422);
				});
			});
		});

		describe("Logging In", () => {
			beforeEach(async () => {
				await api.post("/api/chatter/register").send(chatterDetails[1]);
			});
			it("should give status 200 for a successful login", async () => {
				await api
					.post("/api/chatter/login")
					.send({
						username: chatterDetails[1].username,
						password: chatterDetails[1].password,
					})
					.expect(200);
			});
			it("should give status 403 for wrong password", async () => {
				await api
					.post("/api/chatter/login")
					.send({
						username: chatterDetails[1].username,
						password: "wrongPassword",
					})
					.expect(403);
			});
			it("should give status 404 if the user doesnt exist", async () => {
				await api
					.post("/api/chatter/login")
					.send({
						username: "wrongUser",
						password: "wrongPassword",
					})
					.expect(404);
			});
			it("should give status 422 if username is missing", async () => {
				await api
					.post("/api/chatter/login")
					.send({
						password: "wrongPassword",
					})
					.expect(422);
			});
			it("should give status 422 if password is missing", async () => {
				await api
					.post("/api/chatter/login")
					.send({
						username: "wrongUser",
					})
					.expect(422);
			});
		});
		describe("getting by username", () => {
			beforeEach(async () => {
				await api.post("/api/chatter/register").send(chatterDetails[0]);
			});
			it("should return chatter with the given username if exists", async () => {
				const res = await api.get(
					`/api/chatter/username/${chatterDetails[0].username}`
				);

				const chatter: ChatterType = res.body;
				assert.strictEqual(chatter.username, chatterDetails[0].username);
			});
			it("should give status 404 if the given username doesnt exists", async () => {
				await api.get("/api/chatter/username/doesntExist").expect(404);
			});
		});
		describe("getting by id", () => {
			let chatter: ChatterType;
			beforeEach(async () => {
				const res = await api
					.post("/api/chatter/register")
					.send(chatterDetails[0]);
				chatter = res.body;
			});
			it("should return chatter with the given id if exists", async () => {
				const res = await api.get(`/api/chatter/id/${chatter.id}`);

				const returnedChatter: ChatterType = res.body;
				assert.strictEqual(returnedChatter.id, chatter.id);
			});
			it("should give status 404 if the chatter with given id doesnt exists", async () => {
				await api.get("/api/chatter/id/68413e03a2c330d60e1e35a1").expect(404);
			});
		});
	});

	describe("Authorized Routes", () => {
		let chatters: NewChatterType[] = [
			{
				username: "similar1",
				password: "atleast8",
				displayName: "Similar",
			},
			{
				username: "similar2",
				password: "atleast8",
				displayName: "Similar2",
			},
			{
				username: "similar3",
				password: "atleast8",
				displayName: "Similar3",
			},
			{
				username: "different1",
				password: "atleast8",
				displayName: "Different1",
			},
		];
		let token = "";
		let returnList: ChatterType[] = [];
		beforeEach(async () => {
			await api.post("/api/test/resetDb");
			const chatterList = chatters.map((chatter) =>
				api.post("/api/chatter/register").send(chatter)
			);
			await Promise.all(chatterList);
			const list = await Promise.all(chatters.map(chatter => api.get(`/api/chatter/username/${chatter.username}`)))
			returnList = list.map((res) => {
				return res.body;
			});
			// * using the first element on the list as our logged in chatter
			const res = await api.post("/api/chatter/login").send(chatters[0]);
			token = `Bearer ${res.body.token}`;
		});
		describe("Adding friend", () => {
			it("should return status 401 without any auth", async () => {
				await api
					.post(`/api/chatter/addFriend/${returnList[0].id}`)
					.expect(401);
			});
			describe("Auth is added", () => {
				it("should return status 200 and should add both's id to friendList", async () => {
					// adding returnList[1] user as friend
					await api
						.post(`/api/chatter/addFriend/${returnList[1].id}`)
						.set({ authorization: token })
						.expect(200);
					// logging in as friend aswell to get the token to get friendlist
					// we can use either returnList or chatter it doesnt matter cuz Pormise.all preserves order
					let res = await api.post("/api/chatter/login").send({
						username: chatters[1].username,
						password: chatters[1].password,
					});
					let friendToken = res.body.token;
					let includesInBoth = false;
					// getting friendlist of both chatter and Friend
					let friendListOfChatter: ChatterType[] = (
						await api.get("/api/chatter/friends").set({ authorization: token })
					).body;
					let friendListOfFriend: ChatterType[] = (
						await api
							.get("/api/chatter/friends")
							.set({ authorization: `Bearer ${friendToken}` })
					).body;
					if (
						friendListOfChatter.find((value) => value.id === returnList[1].id) &&
						friendListOfFriend.find(value => value.id === returnList[0].id)
					) {
						includesInBoth = true;
					}

					assert.strictEqual(includesInBoth, true);
				});
			});
			it("should return all friends", async () => { });
		});
		it("should return all matching display name users when searching", async () => {
			const res = await api
				.get("/api/chatter/search")
				.send({
					displayName: "Similar",
				})
				.set({ authorization: token });
			assert.strictEqual(res.body.chatters.length, 3);
		});
		describe("deleting a chatter", () => {
			it("should delete the loggedIn user and return status 204", async () => {
				await api
					.delete("/api/chatter/delete")
					.set({ authorization: token })
					.expect(204);

				// making sure the chatter is deleted
				await api
					.get(`/api/chatter/username/${chatters[0].username}`)
					.expect(404);
			});
		});
	});
	after(async () => {
		await gqServer.stop()
		await mongoose.disconnect()
		console.log("Test Db Disconnected");
		console.log("Chatter Test Finished");
	})
});
