import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";
import { chatterServices } from "../services/chatter.services";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { SECRETKEY } from "./config";
import type { ChatterType, JwtPayload } from "../chatterTypes";
import { ServerError } from "./errors";
import { MongoServerError } from "mongodb";
import { logger } from "./helpers";

interface ErrorType {
	name?: string;
	description: string;
	options?: object;
}

interface SentError {
	error: ErrorType;
}

export const errorHandler = (
	error: unknown,
	_req: Request,
	res: Response<SentError>,
	next: NextFunction
) => {
	if (error instanceof ServerError) {
		res.status(error.statusCode).json({
			error: {
				name: error.name,
				description: error.message,
				options: error.options,
			},
		});
		next();
		return;
	}

	if (error instanceof MongoServerError) {
		if (error.code === 11000) {
			res.status(409).json({
				error: {
					description:
						"The resource that you are trying to create already exists",
					name: "DUPLICATE_RESOURCE",
					options: {
						input: error.errorResponse.keyValue,
					},
				},
			});
			return
		}
		logger.log(error instanceof JsonWebTokenError)
		if (error instanceof JsonWebTokenError) {
			res.status(403).json({
				error: {
					description: error.message,
					name: error.name
				}
			})
		}
		// ! Remove this after DDebugging
		logger.log("######################");
		logger.log("|");
		logger.log(error);
		logger.log("|");
		logger.log("######################");
		// ! Remove this after DDebugging
		res.status(500).json({
			error: {
				description: "Something bad happened in db. Tell the developer what you were doing when this happened"
			}
		})
	}

	if (error instanceof ZodError) {
		res.status(422).json({
			error: {
				name: error.name,
				description: "Input validation failed",
				options: {
					errors: error.issues,
				},
			},
		});
		next();
		return;
	}
	if (error instanceof Error) {
		res.status(500).json({
			error: {
				description:
					"You did something that the developer didnt anticipate for, You are to be blamed not me.",
			},
		});
		logger.log(error);
	}
};

export const chatterAuthentication = async (
	_req: Request,
	_res: Response,
	next: NextFunction
) => {
	const chatter = await extractChatter(_req);
	_req.chatter = chatter;
	next();
};

export const extractChatter = async (_req: Request): Promise<ChatterType> => {
	const auth = _req.get("authorization");
	if (auth === undefined) {
		throw new ServerError("Invalid Request.No Auth found", 401, "NO_AUTH")
	}
	if (!auth?.startsWith("Bearer ")) {
		throw new ServerError("Invalid Auth", 401, "NO_AUTH")
	}
	return await bearerTokenToChatter(auth)
}

export const bearerTokenToChatter = async (auth: string): Promise<ChatterType> => {
	const token: string = auth.slice(7);
	const decodedToken = verify(token, SECRETKEY) as JwtPayload;
	const chatter = await chatterServices.getById(decodedToken.id)
	if (!chatter) {
		throw new ServerError("The chatter doesnt exist", 404, "INVALID_TOKEN")
	}
	return chatter;
}


export const unknownEndPoint = (_req: Request, res: Response) => {
	res.status(404).send("What you looking for?");
};

export const methodLogger = (
	_req: Request,
	_res: Response,
	next: NextFunction
) => {
	logger.log("***-***");
	logger.log(_req.url);
	// logger.log(_req.query);
	// logger.log(_req.body);
	logger.log("***-***");
	next();
};
