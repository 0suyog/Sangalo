import { Types, Schema, model } from "mongoose";
import { MessageValidatorSchema } from "../validators/messageValidator";
import { MessageType } from "../messageTypes";

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
		required: true,
	},
	message: {
		type: String,
		require: true,
		trim: true,
	},
	sentTime: {
		type: Date,
		required: true,
	},
	receivedTime: {
		type: Date,
		required: true,
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
		transform: (_doc, ret): MessageType => {
			ret.id = _doc._id.toString();
			// changing all ObjectId to string so i can parse it properly
			Object.keys(ret).map((key) => {
				if (ret[key] instanceof Types.ObjectId) {
					ret[key] = ret[key].toString();
				}
			})
			return MessageValidatorSchema.parse(ret);
		}
	}
}
);

const Message = model("Message", MessageSchema);

export default Message;
