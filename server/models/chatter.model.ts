import { model, Schema } from "mongoose";
import { ChatterType } from "../chatterTypes";

const ChatterSchema = new Schema(
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

	{
		toJSON: {
			virtuals: true,
			transform: function (_doc, ret): ChatterType {
				let { _id, __v, password, friends, email, ...chatterData } = ret;
				let returnValue = {
					id: _id.toString(),
					...chatterData,
				} as ChatterType;
				return returnValue;
			},
		},
	}
);

// This is just the document type of the Schema its different than Chatter Type cuz mongoose stores id as objectId

export const Chatter = model("Chatter", ChatterSchema);
