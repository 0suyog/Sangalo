import { model, Schema } from "mongoose";
import type { MessageDoc } from "../messageTypes";

const MessageSchema = new Schema<MessageDoc>({
	chatId: {
		type: Schema.ObjectId,
		ref: "Chat",
		required: true
	},
	sender: {
		ref: "Chatter",
		type: Schema.ObjectId,
		required: true,
	},
	receiver: {
		ref: "Chatter",
		type: Schema.ObjectId,
	},
	message: {
		type: String,
		required: true,
		trim: true,
	},
	sentTime: {
		type: Date,
		required: true,
		default: Date.now
	},
	status: {
		type: String,
		enum: ["read", "delivered", "sent"],
		default: 'sent'
	},
	reactions: {
		type: [
			{
				chatter: {
					type: Schema.ObjectId,
					ref: "Chatter",
				},
				reaction: {
					type: String,
					enum: ["like", "love", "sad", "laugh", "cry"],
				},
			},
		],
	},
}
);

const Message = model("Message", MessageSchema);

export default Message;
