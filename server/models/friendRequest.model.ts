import type { FriendRequestDoc } from "friendRequestTypes";
import { model, Schema } from "mongoose";

const FirendRequestSchema = new Schema<FriendRequestDoc>({
  requestedTo: {
    type: Schema.ObjectId,
    ref: "Chatter"
  },
  requestedBy: {
    type: Schema.ObjectId,
    ref: "Chatter"
  },
  quote: {
    type: String,
    maxLength: 64
  },
  sentDate: {
    type: Date,
    default: Date.now
  }
})

const FriendRequest = model("FriendRequest", FirendRequestSchema)

export default FriendRequest;