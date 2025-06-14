import { z } from "zod/v4"
import { ChatStatusUpdateSchema, NewChatSchema } from "./typeValidators/chatValidator"
import type { ChatterDoc, ChatterType } from "chatterTypes"
import type { MongoID } from "types"
import type { MessageDoc, MessageReturnType, MessageStatusType } from "messageTypes"
import { Types } from "mongoose"
export type NewChatType = z.infer<typeof NewChatSchema>
export interface BaseChatType {
  name?: string
  status?: MessageStatusType
  isGroup: boolean
}

export interface ChatReturnType extends BaseChatType {
  id: MongoID
  latestMessage?: MessageReturnType
  participants: ChatterType[]
}

export interface ChatDoc extends BaseChatType {
  latestMessage:Types.ObjectId
  _id:Types.ObjectId
  participants:Types.ObjectId[]
}

export interface PopulatedChatType extends BaseChatType {
  _id: Types.ObjectId
  latestMessage: MessageDoc
  participants: ChatterDoc[]
}

export type ChatStatusUpdateType = z.infer<typeof ChatStatusUpdateSchema>