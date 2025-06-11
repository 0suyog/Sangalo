import { z } from "zod/v4";
import { MongoIdSchema } from "./commonValidators";

export const Reactions = z.enum(["like", "love", "sad", "laugh", "cry"]);
export const Status = z.enum(['delivered', 'read'])

export const MessageReaction = z.object({
  chatter: MongoIdSchema,
  reaction: Reactions,
});

export const FirstMessageSchema = z.object({
  receiver: MongoIdSchema,
  message: z.string().trim(),
})

export const NewMessageSchema = FirstMessageSchema.omit({ receiver: true }).extend({
  chatId: MongoIdSchema,
})

export const MessageReturnSchema = NewMessageSchema.extend({
  id: MongoIdSchema,
  sender: MongoIdSchema,
  receiver: MongoIdSchema,
  sentTime: z.date(),
  reactions: z.array(MessageReaction)
})

export const MessageFilterSchema = z.object({
  start: z.date(),
  count: z.number()
})
