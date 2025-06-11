import { z } from "zod/v4";
import { MongoIdSchema } from "./commonValidators";

export const NewChatSchema = z.object({
  name: z.string().optional(),
  participants: z.array(MongoIdSchema).refine(participants => participants.length, "There should be at least a participants to have a chat"),
}).refine((data) => {
  return !(data.participants.length > 1 && data.name === undefined)
}, { error: "Number of participants are more than two. if you are trying to create a group You should include name field aswell", })
export const ChatValidationSchema = NewChatSchema.extend({
  id: MongoIdSchema,
})