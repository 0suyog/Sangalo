import { model, Schema, Types } from "mongoose";
import { ChatterType, NewChatterType } from "../types";

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
			transform: function (doc): ChatterType {
				let { _id, __v, password, ...chatterData } = doc;
				let returnValue = {
					id: _id.toString(),
					...chatterData,
					friends: chatterData.friends.map((id) => id.toString()),
				};
				return returnValue;
			},
		},
	}
);

// This is just the document type of the Schema its different than Chatter Type cuz mongoose stores id as objectId
interface ChatterDoc extends NewChatterType {
	status: "online" | "offline" | "idle" | "dnd";
	friends: Types.ObjectId[];
	toJSON(): ChatterType;
}

export const Chatter = model("Chatter", ChatterSchema);
