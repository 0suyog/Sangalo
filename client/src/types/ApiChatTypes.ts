import type { ReceivedChatterType } from "./ApiChatterTypes";
import type { ReceivedMessageType } from "./messageTypes";


export type ChatStatusType = 'delivered' | 'read' | 'sent'

export interface ReceivedChatType {
  id: string,
  latestMessage: ReceivedMessageType,
  participants: ReceivedChatterType[]
  name: string | null,
  isGroup: boolean
  status: ChatStatusType
}


export interface AllChatsQuery {
  getChats: ReceivedChatType[]
}

export interface NewChatType {
  participants: string[]
  name: string
}



