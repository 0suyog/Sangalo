import type { Types } from "mongoose";
import type { ChatReturnType } from "./chatTypes";
import { NewMessageSchema, MessageReaction, FirstMessageSchema, MessageReturnSchema, MessageStatusSchema, MessageReactedSchema, MessageFilterSchema } from "./typeValidators/messageValidator";
import { z } from "zod/v4";

export type MessageReactionType = z.infer<typeof MessageReaction>
export type FirstMessageType = z.infer<typeof FirstMessageSchema>
export type NewMessageType = z.infer<typeof NewMessageSchema>;
export type MessageStatusType = z.infer<typeof MessageStatusSchema>
export type MessageReturnType = z.infer<typeof MessageReturnSchema>
export type MessageReactedType = z.infer<typeof MessageReactedSchema>
export interface FirstMessageReturnType extends Omit<MessageReturnType, "chatId"> {
  chat: ChatReturnType
}
export type MessageFilterType = z.infer<typeof MessageFilterSchema>

export interface MessageDoc {
  message: string,
  _id: Types.ObjectId,
  chatId: Types.ObjectId,
  sender: Types.ObjectId,
  receiver?: Types.ObjectId,
  sentTime: Date,
  status: MessageStatusType,
  reactions: (Omit<MessageReactionType, "chatter"> & { chatter: Types.ObjectId })[]
}


export interface SubscriptionToken {
  auth: string
}