import { model, Schema } from "mongoose";
import type { ChatDoc } from "../chatTypes";

const ChatSchema = new Schema<ChatDoc>(
	{
		isGroup: {
			type: Boolean,
			default: false,
		},
		participants: {
			type: [{ type: Schema.ObjectId, ref: "Chatter" }],
			required: true,
		},
		name: {
			type: String,
		},
		latestMessage: {
			type: Schema.ObjectId,
			ref: "Message"
		},
		status: {
			type: String,
			enum: ['read', 'delivered', 'sent']
		}
	},
);

const Chat = model("Chat", ChatSchema);

export default Chat;
