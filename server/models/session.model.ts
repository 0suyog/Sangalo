import { Model, Schema, Types } from "mongoose";

const ChatSchema = new Schema(
	{
		isGroup: {
			type: Boolean,
			default: false,
		},
		participants: {
			type: [{ type: Types.ObjectId, ref: "Chatter" }],
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		newMessage: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		toJSON: {
			transform: (doc, ret) => {
				delete ret._id;
				delete ret.__v;
				ret.id = doc._id;
				return ret;
			},
		},
	}
);

const Chat = new Model("Chat", ChatSchema);

export default Chat;
