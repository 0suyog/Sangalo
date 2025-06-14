import { z } from "zod/v4";
import { MongoIdSchema } from "./commonValidators";

export const Reactions = z.enum(["like", "love", "sad", "laugh", "cry"]);
export const MessageStatusSchema = z.enum(['delivered', 'read', 'sent'])

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
  receiver: MongoIdSchema.optional(),
  sentTime: z.date(),
  reactions: z.array(MessageReaction)
})

export const MessageFilterSchema = z.object({
  earliest: z.string().optional(),
  count: z.number(),
  chatId: MongoIdSchema
})


export const MessageReactedSchema = z.object({
  chatId: MongoIdSchema,
  messageId: MongoIdSchema,
  reaction: Reactions
})

// export const MessageReactedSchema = MessageReactedSchema.extend({
// })

