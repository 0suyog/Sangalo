import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
	{
		sender: {
			ref: "Chatter",
			type: mongoose.Types.ObjectId,
			required: true,
		},
		receiver: {
			ref: "Chatter",
			type: mongoose.Types.ObjectId,
			required: true,
		},
		sentTime: {
			type: Date,
			required: true,
		},
		receivedTime: {
			type: Date,
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
			required: true,
		},
		delivered: {
			type: Boolean,
			default: false,
			required: true,
		},
		draft: {
			type: String,
		},
		reactions: {
			type: [
				{
					Chatter: {
						type: mongoose.Types.ObjectId,
						ref: "Chatter",
					},
					reaction: {
						type: String,
						enum: ["like", "love", "sad", "laugh", "cry"],
					},
				},
			],
		},
		edited: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
