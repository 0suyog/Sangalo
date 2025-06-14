import { after, before, beforeEach, describe, it } from "node:test";
import supertest from "supertest";
import type { ChatterType, NewChatterType } from "../chatterTypes";
import TestAgent from "supertest/lib/agent";
import Test from "supertest/lib/test";
import createApp from "../app";
import mongoose from "mongoose";
import { chatStatusUpdateMutation, firstMessageMutation, messageMutation, reactMessageMutation } from "./queries";
import { ok, strictEqual } from "assert";
import { arraysAreEqual } from "./testHelpers";
import { ApolloServer } from "@apollo/server";
import type { MessageReturnType } from "../messageTypes";
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

  before(async () => {
    let app = await createApp()
    api = supertest(app)
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
    it("send first message to get chat id that has the two participants the status of the chat will be sent when sending any message", async () => {
      const res = await api.post("/api/graphql")
        .send(firstMessageMutation("First Message", chatterWithId[1].id))
        .set({ authorization: authenticatedUserToken })
      strictEqual(res.body.errors, undefined)
      ok(arraysAreEqual(
        // I did this way to cuz i became lazy participants should be full ChatterType
        [
          res.body.data.firstMessage.chat.participants[0].id,
          res.body.data.firstMessage.chat.participants[1].id
        ],
        [
          chatterWithId[0].id,
          chatterWithId[1].id
        ]))
      strictEqual(res.body.data.firstMessage.message, 'First Message')
      strictEqual(res.body.data.firstMessage.chat.status, "sent")
    })
    describe("After first message", () => {
      let chatId = ""
      let messageId = ""
      beforeEach(async () => {
        await api.post("/api/test/resetMessages");
        await api.post("/api/test/resetChat")
        const res = await api.post("/api/graphql")
          .send(firstMessageMutation("First Message", chatterWithId[1].id)).set({ authorization: authenticatedUserToken })
        messageId = res.body.data.firstMessage.id
        chatId = res.body.data.firstMessage.chat.id
      })
      it("sending message with chatId should send it to right chatter", async () => {
        let res = await api.post("/api/graphql").send(messageMutation("message", chatId)).set({ authorization: authenticatedUserToken })
        let message: MessageReturnType = res.body.data.message
        strictEqual(message.receiver, chatterWithId[1].id);
        strictEqual(message.message, "message");
        strictEqual(message.chatId, chatId)
      })
      it("shouldn't be able to send first message if chatId already exists", async () => {
        let res = await api.post('/api/graphql')
          .send(firstMessageMutation('message', chatterWithId[1].id))
          .set({ authorization: authenticatedUserToken })
        strictEqual(res.body.errors[0].extensions.code, "CHAT_ALREADY_EXISTS")
      })
      it("should be able to react to message", async () => {
        let res = await api.post("/api/graphql").send(reactMessageMutation(messageId, chatId, "cry")).set({ authorization: authenticatedUserToken })
        strictEqual(res.body.data.messageReaction.reactions[0].chatter, chatterWithId[0].id)
        strictEqual(res.body.data.messageReaction.reactions[0].reaction, 'cry')
      })
      it("should be able to change status of chat", async () => {
        let res = await api.post("/api/graphql").send(chatStatusUpdateMutation(chatId, "read")).set({ authorization: authenticatedUserToken })
        strictEqual(res.body.data.chatStatusUpdate.status, 'read')
      })
    })
  })
})