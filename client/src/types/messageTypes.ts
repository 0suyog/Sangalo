import type { ReceivedChatType } from "./ApiChatTypes"

export interface MessageFilterType {
  earliest?: Date
  count: string,
  chatId: string
}

export type Reactions = "like" | "love" | "sad" | "laugh" | "cry"

export interface MessageReaction {
  chatter: string,
  reactions: Reactions
}

export interface ReceivedMessageType {
  id: string,
  sender: string,
  receiver?: string,
  sentTime: Date,
  reaction: Array<Reactions>
  message: string,
  chatId: string
}

export interface FirstMessage {
  receiver: string,
  message: string
}

export interface FirstMessageReturnType extends Omit<ReceivedMessageType, "chatId"> {
  chat: ReceivedChatType
}