import { isDate, isMongoID } from "../typeGuards";
import { MongoID } from "./../types";
import { z } from "zod";

export const Reactions = z.enum(["like", "love", "sad", "laugh", "cry"]);
export const Status = z.enum(['delivered', 'read'])

export const MessageReaction = z.object({
  chatter: z.string().refine((chatter): chatter is MongoID => {
    return isMongoID(chatter);
  }, "Expected valid Id"),
  reaction: Reactions,
});

export const BaseMessageSchema = z.object({
  receiver: z.string().refine((receiver): receiver is MongoID => {
    return isMongoID(receiver);
  }, "Expected valid Id"),
  sender: z.string().refine((sender): sender is MongoID => {
    return isMongoID(sender);
  }, "Expected valid Id"),
  chatId: z.string().refine((chatId): chatId is MongoID => {
    return isMongoID(chatId);
  }, "Expected valid Id"),
  message: z.string().trim(),

})

export const NewMessageSchema = BaseMessageSchema.extend({
  sentTime: z.string().refine((date) => {
    return isDate(date);
  }, "Expected a valid Date"),
});

export const MessageValidatorSchema = BaseMessageSchema.extend({
  id: z.string().refine((id): id is MongoID => {
    return isMongoID(id);
  }, "Expected valid Id"),
  sentTime: z.date()
})
