import { Types, Schema, model, now } from "mongoose";
import { MessageReturnSchema } from "../typeValidators/messageValidator";
import { MessageReturnType } from "../messageTypes";

const MessageSchema = new Schema({
	chatId: {
		type: Types.ObjectId,
		ref: "Chat",
	},
	sender: {
		ref: "Chatter",
		type: Types.ObjectId,
		required: true,
	},
	receiver: {
		ref: "Chatter",
		type: Types.ObjectId,
	},
	message: {
		type: String,
		require: true,
		trim: true,
	},
	sentTime: {
		type: Date,
		required: true,
		default: now()
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
					type: Types.ObjectId,
					ref: "Chatter",
				},
				reaction: {
					type: String,
					enum: ["like", "love", "sad", "laugh", "cry"],
				},
			},
		],
	},
}, {
	toJSON: {
		transform: (_doc, ret): MessageReturnType => {
			ret.id = _doc._id.toString();
			// changing all ObjectId to string so i can parse it properly
			Object.keys(ret).map((key) => {
				if (ret[key] instanceof Types.ObjectId) {
					ret[key] = ret[key].toString();
				}
			})
			return MessageReturnSchema.parse(ret);
		}
	}
}
);

const Message = model("Message", MessageSchema);

export default Message;
