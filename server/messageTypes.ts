import { ChatType } from "./chatTypes";
import { NewMessageSchema, MessageReaction, FirstMessageSchema, MessageReturnSchema, Status } from "./typeValidators/messageValidator";
import { z } from "zod/v4";

export type MessageReactionType = z.infer<typeof MessageReaction>
export type FirstMessageType = z.infer<typeof FirstMessageSchema>
export type NewMessageType = z.infer<typeof NewMessageSchema>;
export type MessageStatusType = z.infer<typeof Status>
export type MessageReturnType = z.infer<typeof MessageReturnSchema>
export interface FirstMessageReturnType extends Omit<MessageReturnType, "chatId"> {
  chat: ChatType
}
