import type { ReceivedChatType } from "./ApiChatTypes"

export interface MessageFilterType {
  earliest?: Date
  count: number,
  chatId: string
}

export type Reactions = "like" | "love" | "sad" | "laugh" | "cry"

export interface MessageReaction {
  chatter: string,
  reactions: Reactions
}

export interface NewMessageType {
  chatId: string,
  message: string
}

export interface ReceivedMessageType extends NewMessageType {
  id: string,
  sender: string,
  receiver?: string,
  sentTime: Date,
  reactions: Array<Reactions>
}

export interface FirstMessageType {
  receiver: string,
  message: string
}

export interface GetAllMessagesQueryType {
  getMessages: ReceivedMessageType[]
}

export interface MessageSubscriptionType {
  message: ReceivedMessageType
}

export interface SendMessageMutationType {
  message: ReceivedMessageType
}

export interface SendFirstMessageMutationType {
  firstMessage: ReceivedFirstMessageType
}

export interface ReceivedFirstMessageType extends Omit<ReceivedMessageType, "chatId reactions"> {
  chat: ReceivedChatType
}