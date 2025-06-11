import { compare } from "bcryptjs";
import { Chatter } from "../models/chatter.model";
import {
	ChatterType,
	LoginType,
	NewChatterType,
	SearchType,
	TokenType,
} from "../chatterTypes";
import { sign } from "jsonwebtoken";
import { NODE_ENV, SECRETKEY } from "../utils/config";
import { ServerError } from "../utils/errors";
import { hash } from "bcryptjs";
import { isMongoID } from "../typeGuards";
import { MongoID } from "../types";
import { Types } from "mongoose";

const addChatter = async (chatter: NewChatterType) => {
	let hashedPassword = await hash(chatter.password, 7);
	chatter.password = hashedPassword;
	await new Chatter(chatter).save();
};

const checkUserAvailability = async (username: string): Promise<boolean> => {
	let exists = await Chatter.exists({ username: username });
	if (!exists) return false;
	return true;
};

const getByUsername = async (username: string): Promise<ChatterType> => {
	let chatter = await Chatter.findOne({ username: username });
	if (chatter) {
		return chatter.toJSON<ChatterType>();
	}
	throw new ServerError(
		"User with that username was not found",
		404,
		"NOT_FOUND_ERROR",
		{
			inputs: { username },
		}
	);
};

const getById = async (id: string): Promise<ChatterType> => {
	if (!isMongoID(id)) {
		throw new ServerError("Invalid Id", 422, "INVALID_ID", { id })
	}
	let chatter = await Chatter.findById(id);
	if (chatter) {
		return chatter.toJSON<ChatterType>();
	}
	throw new ServerError(
		"User with that id was not found",
		404,
		"NOT_FOUND_ERROR",
		{
			inputs: { id },
		}
	);
};

const getFriends = async (id: string): Promise<ChatterType[]> => {
	if (!isMongoID(id)) {
		throw new ServerError("Invalid Id", 422, "INVALID_ID", { id })
	}
	let chatter = await Chatter.findById(id, { _id: 0, friends: 1 }).populate("friends", "-friends, -email, -password").lean<{ friends: (Omit<ChatterType, "id"> & { _id: Types.ObjectId })[] }>();
	if (chatter) {
		return chatter.friends.map(({ _id, ...friendData }) => {
			return {
				...friendData,
				id: _id.toString() as MongoID
			}
		});
	}
	throw new ServerError(
		"User with that id was not found",
		404,
		"NOT_FOUND_ERROR",
		{ inputs: { id } }
	);
};

const loginChatter = async (chatterData: LoginType): Promise<TokenType> => {
	const { username, password } = chatterData;
	const chatter = await Chatter.findOne({ username: username });
	if (chatter) {
		let validation = await compare(password, chatter.password);
		if (!validation) {
			throw new ServerError(
				"The Password didn't match",
				403,
				"WRONG_PASSWORD",
				{ inputs: { chatterData } }
			);
		}
		const token = sign(
			{
				username: chatter.username,
				id: chatter._id.toString(),
			},
			SECRETKEY,
			{ expiresIn: "1d" }
		);
		return {
			token: token,
		};
	}
	throw new ServerError(
		"Chatter with that username was not found",
		404,
		"NOT_FOUND_ERROR",
		{ inputs: { ...chatterData } }
	);
};

const addFriend = async (chatterId: string, friendId: string) => {
	if (!isMongoID(chatterId)) {
		throw new ServerError("Invalid Id", 422, "INVALID_ID", { chatterId })
	}
	if (!isMongoID(friendId)) {
		throw new ServerError("Invalid Id", 422, "INVALID_ID", { friendId })
	}
	const friend = await Chatter.findById(friendId);
	if (!friend) {
		throw new ServerError(
			"The Chatter you are trying to befirend is unavailable",
			404,
			"NOT_FOUND_ERROR",
			{
				inputs: { friendId },
			}
		);
	}
	const chatter = await Chatter.findById(chatterId);
	if (!chatter) {
		throw new ServerError("Chatter not found", 404, "NOT_FOUND_ERROR", {
			inputs: { chatterId, friendId },
		});
	}
	if (!chatter.friends.includes(friend._id)) {
		chatter.friends.push(friend._id);
		friend.friends.push(chatter._id);
	}
	await chatter.save();
	await friend.save();
	return;
};

const searchChatter = async (
	filter: SearchType
): Promise<ChatterType[]> => {
	const results = await Chatter.find(
		{ displayName: { $regex: `^${filter.displayName}` } },
		"-friends -password -email"
	);

	return results.map((friend) => {
		return {
			id: friend._id.toString() as MongoID,
			username: friend.username,
			status: friend.status,
			displayName: friend.displayName,
		};
	});
};

const deleteChatter = async (id: string) => {
	if (!isMongoID(id)) {
		throw new ServerError("Invalid Id", 422, "INVALID_ID", { id })
	}
	await Chatter.deleteOne({ _id: id });
};

const areFriends = async (chatterId: MongoID, friendsId: MongoID[]): Promise<Boolean> => {
	const exists = await Chatter.exists({ _id: chatterId, friends: { $all: friendsId } })
	return Boolean(exists);
}

// For Testing purposes only
const resetChatterDb = async () => {
	if (NODE_ENV !== "test") {
		throw new ServerError("Cannot reset Db on a non test environment", 400);
	}
	await Chatter.deleteMany({});
};

export const chatterServices = {
	addChatter,
	getByUsername,
	getById,
	getFriends,
	loginChatter,
	addFriend,
	searchChatter,
	checkUserAvailability,
	resetChatterDb,
	deleteChatter,
	isFriend: areFriends
};
