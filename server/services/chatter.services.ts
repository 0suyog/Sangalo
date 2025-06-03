import { compare } from "bcryptjs";
import { Chatter } from "../models/chatter.model";
import { ChatterType, LoginType, NewChatterType, TokenType } from "../types";
import { sign } from "jsonwebtoken";
import { SECRETKEY } from "../utils/config";

const addChatter = async (chatter: NewChatterType): Promise<ChatterType> => {
	let newChatter = await new Chatter(chatter).save();
	return newChatter.toJSON<ChatterType>();
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

const getFriends = async (id: string): Promise<string[]> => {
	let chatter = await Chatter.findById(id, "-_id friends").lean();
	if (chatter) {
		return chatter.friends.map((id) => id.toString());
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
		let validation = compare(password, chatter.password);
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
				id: chatter._id,
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
		"CHATTER_NOT_FOUND",
		{ inputs: { ...chatterData } }
	);
};

export const chatterServices = {
	addChatter,
	getByUsername,
	getById,
	getFriends,
	loginChatter,
};
