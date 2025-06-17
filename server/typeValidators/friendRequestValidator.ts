import { z } from "zod/v4";
import { MongoIdSchema } from "./commonValidators";

export const FriendRequestSchema = z.object({
  requestedTo: MongoIdSchema,
  quote: z.string().max(64)
})