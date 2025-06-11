import { z } from "zod/v4";

export const LoginSchema = z.object({
	username: z
		.string()
		.min(4, "Username must be 4 letters long")
		.max(16, "Username can not exceed 16 letters"),
	password: z
		.string()
		.min(8, "Password must be 8 letters long")
		.max(64, "Password can not exceed 64 letters"),
});

export const NewChatterSchema = LoginSchema.extend({
	displayName: z
		.string()
		.min(4, "Display name should be 4 letters long")
		.max(16, "Display name should not exceed 16 letters"),
	email: z.string().optional(),
});

export const SearchSchema = z.object({
	displayName: z.string(),
});
