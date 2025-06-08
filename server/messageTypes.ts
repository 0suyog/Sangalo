import { MessageReaction, MessageValidatorSchema, NewMessageSchema } from "./validators/messageValidator";
import { z } from "zod";


export type MessageReactionType = z.infer<typeof MessageReaction>
export type NewMessageType = z.infer<typeof NewMessageSchema>;
export type MessageStatusType = z.infer<typeof MessageReaction>

export type MessageType = z.infer<typeof MessageValidatorSchema>