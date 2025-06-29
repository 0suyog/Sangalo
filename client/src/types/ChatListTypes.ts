import type { ReceivedChatterType } from "./ApiChatterTypes";
import type { ChatStatusType, ReceivedChatType } from "./ApiChatTypes";

export interface NonGroupChatListType extends Omit<ReceivedChatType, "name isGroup"> {
  isGroup: false
}


export type ChatListType = ({ type: "chat", pictures: string[] } & ReceivedChatType)
  | ({ type: "friend", chatStatus: ChatStatusType } & Omit<ReceivedChatterType, "email">)