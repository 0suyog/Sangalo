import type { HydratedDocument } from "mongoose";
import type { ChatReturnType, ChatStatusUpdateType, NewChatType, PopulatedChatType } from "../chatTypes";
import Chat from "../models/chat.model";
import type { MongoID } from "../types";
import { ServerError } from "../utils/errors";
import { chatterServices } from "./chatter.services";
import { returnableMessage } from "serviceHelper/message.helper";
import { returnableChatter } from "serviceHelper/chatter.helper";
const createChatRoom = async (chatterId: MongoID, chatDetails: NewChatType): Promise<ChatReturnType> => {
  if (!await chatterServices.areFriends(chatterId, chatDetails.participants)) {
    throw new ServerError("At least one participant isn't friend with the authenticated Chatter", 500, "NOT_FRIENDS")
  }
  chatDetails.participants.push(chatterId)
  const savedDocument = await new Chat(chatDetails).save()
  const newChat: HydratedDocument<PopulatedChatType> = await savedDocument.populate("participants", "username displayName status _id")
  return {
    participants: newChat.participants.map(participant => {
      return returnableChatter(participant)
    }),
    id: newChat.id,
    isGroup: newChat.isGroup
  }
}
// There will be no receiver if the the chat is a group so we return null else we return receiver id
const getReceiver = async (chatId: MongoID, sender: MongoID): Promise<MongoID | null> => {
  let chat = await Chat.findById(chatId).lean()
  if (!chat) {
    throw new ServerError("There is no chat that exists with that id", 404, "CHAT_DOESNT_EXIST")
  }
  if (chat.isGroup) {
    return null
  }
  let receiverId = chat.participants.find(id => id.toString() !== sender)
  if (!receiverId) {
    throw new Error("There should always be receiverId")
  }
  return receiverId.toString() as MongoID
}

const getChatParticipants = async (chatId: MongoID): Promise<MongoID[]> => {
  const chat = await Chat.findById(chatId, "-_id participants")
  if (!chat) {
    throw new ServerError("Chat doesnt exist", 50)
  }
  return chat.participants.map(id => id.toString() as MongoID)
}

const updateChatStatus = async (chatterId: MongoID, chatDetails: ChatStatusUpdateType): Promise<ChatReturnType> => {
  const updatedChat = await Chat.findOneAndUpdate({ _id: chatDetails.chatId, participants: chatterId }, { status: chatDetails.status }, { new: true })
  if (!updatedChat) {
    throw new ServerError("You arent authorized perform this operation", 403, "NOT_AUTHORIZED")
  }
  const populatedChat: HydratedDocument<PopulatedChatType> = await updatedChat.populate([{
    path: "participants",
    select: "username displayName status _id",
  }, {
    path: "latestMessage",
  }])
  return {
    participants: populatedChat.participants.map(participant => {
      return returnableChatter(participant)
    }),
    latestMessage: returnableMessage(populatedChat.latestMessage),
    id: populatedChat._id.toString() as MongoID,
    isGroup: populatedChat.isGroup,
    status: populatedChat.status
  }
}

const updateChatLatestMessage = async (message: { id: MongoID, chatId: MongoID }): Promise<ChatReturnType> => {
  let updatedChat = await Chat.findByIdAndUpdate(message.chatId, { latestMessage: message.id, status: "sent" }, { new: true })
  if (!updatedChat) {
    throw new ServerError("The chat doesnt seem to exist", 404, "CHAT_DOESNT_EXIST")
  }
  const populatedChat: HydratedDocument<PopulatedChatType> = await updatedChat.populate([{
    path: "participants",
    select: "username displayname status _id",
  }, {
    path: "latestMessage",
  }])
  return {
    participants: populatedChat.participants.map(participant => {
      return returnableChatter(participant)
    }),
    latestMessage: returnableMessage(populatedChat.latestMessage),
    id: populatedChat._id.toString() as MongoID,
    isGroup: populatedChat.isGroup
  }
}

const chatExists = async (sender: MongoID, participants: MongoID[], name?: string): Promise<Boolean> => {
  if (name) {
    let chat = await Chat.findOne({ participants: { $all: [...participants, sender] }, name: name }).lean()
    if (chat) {
      return true
    }
    return false
  }
  let chat = await Chat.exists({ participants: { $all: [...participants, sender] }, name: { $exists: false } });
  if (chat) {
    return true;
  }
  return false
}


const resetChatDb = async () => {
  await Chat.deleteMany({})
}
const chatServices = {
  createChatRoom,
  resetChatDb,
  getReceiver,
  chatExists,
  updateChatStatus,
  updateChatLatestMessage,
  getChatParticipants
}

export default chatServices