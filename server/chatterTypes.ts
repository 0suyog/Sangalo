import { z } from "zod/v4";
import {
	LoginSchema,
	NewChatterSchema,
	SearchSchema,
} from "./typeValidators/chatterValidator";
import type { MongoID } from "./types";
import type { Types } from "mongoose";

export type NewChatterType = z.infer<typeof NewChatterSchema>;
export interface ChatterType extends Omit<NewChatterType, "password" | "email"> {
	status: "online" | "offline" | "idle" | "dnd";
	id: MongoID;
}

export interface ChatterDoc {
	_id: Types.ObjectId,
	email?: string,
	status: "online" | "offline" | "idle" | "dnd";
	friends: Types.ObjectId[]
	password: string
	username: string,
	displayName: string
}

export interface populatedChatterDoc extends Omit<ChatterDoc, "friends"> {
	friends: ChatterDoc[]
}

export interface PopulatedChatterType extends ChatterType {
	friends: ChatterType[]
}

export type ChatterSearchResponse = {
	chatters: ChatterType[];
};

export type LoginType = z.infer<typeof LoginSchema>;

export interface TokenType {
	token: string;
}

export interface JwtPayload {
	username: string;
	id: string;
}

export type SearchType = z.infer<typeof SearchSchema>;
