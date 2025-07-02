import type { ReceivedChatterType } from "./ApiChatterTypes";
import type { ChatStatusType, ReceivedChatType } from "./ApiChatTypes";

export interface NonGroupChatListType extends Omit<ReceivedChatType, "name isGroup"> {
  isGroup: false
}

export interface ChatBarType extends ReceivedChatType {
  type: 'chat',
  pictures: string[]
}

export interface FriendBarType extends Omit<ReceivedChatterType, "email"> {
  type: "friend"
  chatStatus: ChatStatusType
}

export type ChatListType = ChatBarType | FriendBarType
