import { z } from "zod";
import { LoginSchema, NewChatterSchema } from "./validators/ChatterValidator";

export type NewChatterType = z.infer<typeof NewChatterSchema>;
export interface ChatterType extends Omit<NewChatterType, "password"> {
	status: "online" | "offline" | "idle" | "dnd";
	friends?: Array<string>;
	id: string;
}

export type LoginType = z.infer<typeof LoginSchema>;

// Type  jwt
export interface TokenType {
	token: string;
}
