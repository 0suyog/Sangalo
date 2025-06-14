import type { MessageDoc, MessageReturnType } from "messageTypes"
import type { MongoID } from "types"

export const returnableMessage = (message: MessageDoc): MessageReturnType => {
  return {
    message: message.message,
    id: message._id.toString() as MongoID,
    sender: message.sender.toString() as MongoID,
    receiver: message.receiver?.toString() as MongoID,
    reactions: returnableReactions(message.reactions),
    sentTime: message.sentTime,
    chatId: message.chatId.toString() as MongoID
  }
}

export const returnableReactions = (reactions: MessageDoc['reactions']): MessageReturnType['reactions'] => {
  return reactions.map(reaction => {
    return {
      chatter: reaction.chatter.toString() as MongoID,
      reaction: reaction.reaction
    }
  })
}