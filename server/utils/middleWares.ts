import { NextFunction, Request, Response } from "express";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";

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

	if (error instanceof Error) {
		res.status(500).json({
			error: {
				description: "Something Went Wrong",
			},
		});
		console.log(error);
		next();
		return;
	}

	if (error instanceof ZodError) {
		res.status(422).json({
			error: {
				name: error.name,
				description: error.message,
				options: {
					errors: error.issues,
				},
			},
		});
		next();
		return;
	}
	res.status(500).json({
		error: {
			description:
				"You did something that the developer didnt anticipate for, You are to be blamed not me.",
		},
	});
};
