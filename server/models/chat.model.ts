import { model, Schema } from "mongoose";
import { ChatValidationSchema } from "../typeValidators/chatValidator";
import { ChatType } from "../chatTypes";

const ChatSchema = new Schema(
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
		newMessage: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		toJSON: {
			transform: (doc, ret): ChatType => {
				delete ret._id;
				delete ret.__v;
				ret.id = doc._id.toString();
				ret.participants = doc.participants.map((participant): string => {
					return participant.toString()
				});
				return ChatValidationSchema.parse(ret);
			},
		},
	}
);

const Chat = model("Chat", ChatSchema);

export default Chat;
