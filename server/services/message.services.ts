import { returnableMessage } from "serviceHelper/message.helper";
import messagingAuthorization from "../auth/message.auth";
import type { FirstMessageReturnType, FirstMessageType, MessageFilterType, MessageReactedType, MessageReturnType, NewMessageType } from "../messageTypes";
import Message from "../models/message.model";
import type { MongoID } from "../types";
import { ServerError } from "../utils/errors";
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
  return returnableMessage(newMessage)
}
const firstMessage = async (senderId: MongoID, message: FirstMessageType): Promise<FirstMessageReturnType> => {
  if (!(await chatServices.chatExists(senderId, [message.receiver]))) {
    let chatRoom = await chatServices.createChatRoom(senderId, { participants: [message.receiver] })
    let addedMessage = await addMessage(senderId, { ...message, chatId: chatRoom.id });
    return {
      chat: { ...chatRoom, status: "sent" },
      ...addedMessage
    }
  }
  throw new ServerError("The Chat already Exists send a message not first message", 500, "CHAT_ALREADY_EXISTS");
}

const getMessages = async (chatterId: MongoID, filter: MessageFilterType): Promise<MessageReturnType[]> => {
  if (! await messagingAuthorization.canSendMessage([chatterId], filter.chatId)) {
    throw new ServerError("You arent authorized to perform this operation", 403, "NOT_AUTHORIZED")
  }
  let dbFilter: { sentTime?: unknown } = {}
  if (filter.earliest) {
    dbFilter.sentTime = { $lt: new Date(filter.earliest) }
  }
  console.log(dbFilter)
  const messages = await Message.find({ chatId: filter.chatId, ...dbFilter }).sort("-sentTime").limit(filter.count)
  console.log(messages)
  return messages.map(message => returnableMessage(message));
}

const messageReacted = async (chatterId: MongoID, reactionDetail: MessageReactedType): Promise<MessageReturnType> => {
  if (! await messagingAuthorization.canSendMessage([chatterId], reactionDetail.chatId)) {
    throw new ServerError("You arent authorized to perform this operation", 403, "NOT_AUTHORIZED")
  }
  const updatedMessage = await Message.findByIdAndUpdate(reactionDetail.messageId, { $push: { reactions: { reaction: reactionDetail.reaction, chatter: chatterId } } }, { new: true })
  if (!updatedMessage) {
    throw new ServerError("Message with that messageId doesnt exist", 404, "MESSAGE_DOESNT_EXIST")
  }
  return returnableMessage(updatedMessage)
}

// test only
const resetMessages = async () => {
  await Message.deleteMany({});
}

const messageServices = {
  addMessage,
  getMessages,
  firstMessage,
  resetMessages,
  messageReacted
}

export default messageServices