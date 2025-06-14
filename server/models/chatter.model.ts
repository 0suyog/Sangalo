import { model, Schema } from "mongoose";
import type { ChatterDoc, ChatterType } from "../chatterTypes";

const ChatterSchema = new Schema<ChatterDoc>(
	{
		username: {
			type: String,
			minLength: 4,
			maxLength: 16,
			unique: true,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		displayName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			default: undefined,
			validate: (e: unknown) => typeof e === "string",
		},
		status: {
			type: String,
			enum: ["offline", "online", "idle", "dnd"],
			default: "offline",
		},
		friends: {
			type: [{ type: Schema.Types.ObjectId, ref: "Chatter" }],
			default: [],
		},
	},
);


export const Chatter = model("Chatter", ChatterSchema);
