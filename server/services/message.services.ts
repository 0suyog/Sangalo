import messagingAuthorization from "../auth/message.auth";
import { FirstMessageReturnType, FirstMessageType, MessageReturnType, NewMessageType } from "../messageTypes";
import Message from "../models/message.model";
import { MongoID } from "../types";
import { ServerError } from "../utils/errors";
import { logger } from "../utils/helpers";
import chatServices from "./chat.services";

const addMessage = async (senderId: MongoID, message: NewMessageType): Promise<MessageReturnType> => {
  if (!messagingAuthorization.canSendMessage([senderId], message.chatId)) {
    throw new ServerError("You aren't authorized to send message here", 500, "AUTHORIZATION_FAILED")
  }
  const receiver = await chatServices.getReceiver(message.chatId, senderId)
  let messageDetails: (NewMessageType & { receiver?: MongoID }) = { ...message }
  if (receiver) {
    messageDetails.receiver = receiver
  }
  const newMessage = new Message({ ...messageDetails, sender: senderId });
  await newMessage.save()
  return newMessage.toJSON<MessageReturnType>()
}
const firstMessage = async (senderId: MongoID, message: FirstMessageType): Promise<FirstMessageReturnType> => {
  if (!(await chatServices.chatExists(senderId, [message.receiver]))) {
    let chatRoom = await chatServices.createChatRoom(senderId, { participants: [message.receiver] })
    let addedMessage = await addMessage(senderId, { ...message, chatId: chatRoom.id });
    return {
      chat: chatRoom,
      ...addedMessage
    }
  }

  throw new ServerError("The Chat already Exists send a message not first message", 500, "CHAT_ALREADY_EXISTS");
}

const getMessages = (chatId: MongoID) => {
  logger.log(chatId)
}

// test only
const resetMessages = async () => {
  await Message.deleteMany({});
}

const messageServices = {
  addMessage,
  getMessages,
  firstMessage,
  resetMessages
}

export default messageServices