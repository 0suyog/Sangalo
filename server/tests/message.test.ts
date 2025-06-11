import { after, before, beforeEach, describe, it } from "node:test";
import supertest from "supertest";
import { ChatterType, NewChatterType } from "../chatterTypes";
import TestAgent from "supertest/lib/agent";
import Test from "supertest/lib/test";
import createApp from "../app";
import mongoose from "mongoose";
import { firstMessageMutation, messageMutation } from "./queries";
import { ok, strictEqual } from "assert";
import { arraysAreEqual } from "./testHelpers";
import { ApolloServer } from "@apollo/server";
import { MessageReturnType } from "../messageTypes";
let api: TestAgent<Test>;

describe("Message Test", () => {
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
  // let authenticatedUser = chatters[0]
  let authenticatedUserToken = ""
  let tokens: string[] = [];
  let chatterWithId: ChatterType[] = []
  let gqServer: ApolloServer<ChatterType>

  before(async () => {
    let { app, apolloServer } = await createApp()
    api = supertest(app)
    gqServer = apolloServer
    await api.post("/api/test/resetDb");
    // registering all users
    let promiseArray = chatters.map(chatter => api.post("/api/chatter/register").send(chatter))
    await Promise.all(promiseArray)
    await Promise.all(promiseArray)
    // logging in all users
    let loginPromises = chatters.map(chatter => api.post("/api/chatter/login").send(chatter))
    let loginResponses = await Promise.all(loginPromises)
    loginResponses.forEach((res) => {
      tokens.push(`Bearer ${res.body.token}`)
    })
    authenticatedUserToken = tokens[0]
    // getting all chatters to get ids
    let getByUsernamePromises = chatters.map(chatter => api.get(`/api/chatter/username/${chatter.username}`))
    chatterWithId = (await Promise.all(getByUsernamePromises)).map(res => res.body)
    // adding the second two users as friends
    await Promise.all(
      chatterWithId.slice(1, 2).map(chatter => {
        return api.post(`/api/chatter/addFriend/${chatter.id}`).set({ authorization: authenticatedUserToken })
      })
    )
  })
  after(async () => {
    await gqServer.stop()
    console.log("Apollo Server Closed")
    await mongoose.disconnect()
    console.log("Test Db Disconnected")
    console.log("Message tests finished")
  })

  it("cannot talk to non friend,sends NOT_FRIENDS error", async () => {
    let nonFriendId = chatterWithId[3].id
    const res = await api
      .post("/api/graphql")
      .send(firstMessageMutation("This wont be sent", nonFriendId))
      .set({ authorization: authenticatedUserToken })
    strictEqual(res.body.errors[0].extensions.code, "NOT_FRIENDS")
  })
  describe("talking with friends", () => {
    it("send first message to get chat id that has the two participants", async () => {
      const res = await api.post("/api/graphql")
        .send(firstMessageMutation("First Message", chatterWithId[1].id))
        .set({ authorization: authenticatedUserToken })
      strictEqual(res.body.errors, undefined)
      ok(arraysAreEqual(res.body.data.firstMessage.chat.participants, [chatterWithId[0].id, chatterWithId[1].id]))
      strictEqual(res.body.data.firstMessage.message, 'First Message')
    })
    describe("After first message", () => {
      let chatId = ""
      beforeEach(async () => {
        await api.post("/api/test/resetMessages");
        await api.post("/api/test/resetChat")
        const res = await api.post("/api/graphql")
          .send(firstMessageMutation("First Message", chatterWithId[1].id)).set({ authorization: authenticatedUserToken })
        chatId = res.body.data.firstMessage.chat.id
      })
      it("pass", async () => {
        strictEqual(2, 2)
      })
      it("sending message with chatId should send it to right chatter", async () => {
        let res = await api.post("/api/graphql").send(messageMutation("message", chatId)).set({ authorization: authenticatedUserToken })
        let message: MessageReturnType = res.body.data.message
        strictEqual(message.receiver, chatterWithId[1].id);
        strictEqual(message.message, "message");
        strictEqual(message.chatId, chatId)
      })
      it.only("shouldn't be able to send first message if chatId already exists", async () => {
        let res = await api.post('/api/graphql')
          .send(firstMessageMutation('message', chatterWithId[1].id))
          .set({ authorization: authenticatedUserToken })
        strictEqual(res.body.data.firstMessage, null)
        strictEqual(res.body.errors[0].extensions.code, "CHAT_ALREADY_EXISTS")
      })
    })
  })
})