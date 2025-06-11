import { ChatType, NewChatType } from "../chatTypes";
import Chat from "../models/chat.model";
import { MongoID } from "../types";
import { ServerError } from "../utils/errors";
import { chatterServices } from "./chatter.services";
const createChatRoom = async (chatterId: MongoID, chatDetails: NewChatType): Promise<ChatType> => {
  if (!await chatterServices.isFriend(chatterId, chatDetails.participants)) {
    throw new ServerError("At least one participant isn't friend with the authenticated Chatter", 500, "NOT_FRIENDS")
  }
  chatDetails.participants.push(chatterId)
  const newChat = await new Chat(chatDetails).save()
  return newChat.toJSON<ChatType>()
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
  chatExists
}

export default chatServices