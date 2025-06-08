import { GraphQLError } from "graphql";

export class ServerError extends Error {
	public statusCode: number;
	public options: object;
	constructor(
		message: string,
		statusCode: number,
		name: string = "ERROR",
		options: object = {}
	) {
		super(message);
		this.statusCode = statusCode;
		this.name = name;
		this.options = options;
	}
}


interface extension {
	code?: string
	invalidArgs?: object
}

export const gqError = (message: string, code: string = "", invalidArgs: object = {}) => {
	let extensions: extension = {}
	if (code) {
		extensions.code = code
	}
	if (Object.keys(invalidArgs).length) {
		extensions.invalidArgs = invalidArgs
	}
	throw new GraphQLError(message, {
		extensions: {
			...extensions
		}
	})
}
