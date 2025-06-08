import { z } from "zod";
import {
	LoginSchema,
	NewChatterSchema,
	SearchSchema,
} from "./validators/chatterValidator";

export type NewChatterType = z.infer<typeof NewChatterSchema>;
export interface ChatterType extends Omit<NewChatterType, "password"> {
	status: "online" | "offline" | "idle" | "dnd";
	id: string;
}

export type ChatterSearchResult = Omit<ChatterType, "email">;
export type ChatterSearchResponse = {
	chatters: ChatterSearchResult[];
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
