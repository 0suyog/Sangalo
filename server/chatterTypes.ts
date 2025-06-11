import { z } from "zod/v4";
import {
	LoginSchema,
	NewChatterSchema,
	SearchSchema,
} from "./typeValidators/chatterValidator";
import { MongoID } from "./types";

export type NewChatterType = z.infer<typeof NewChatterSchema>;
export interface ChatterType extends Omit<NewChatterType, "password" | "email"> {
	status: "online" | "offline" | "idle" | "dnd";
	id: MongoID;
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
