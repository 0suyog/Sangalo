import type { Types } from "mongoose";
import type { FriendRequestSchema } from "typeValidators/friendRequestValidator";
import type { z } from "zod/v4";

export type friendRequestType = z.infer<typeof FriendRequestSchema>

export interface FriendRequestDoc {
  _id: Types.ObjectId,
  requestedBy: Types.ObjectId,
  requestedTo: Types.ObjectId,
  quote?: String,
  sentDate: Date,
}