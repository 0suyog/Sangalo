import {
	errorHandler,
	extractChatter,
	methodLogger,
	unknownEndPoint,
} from "./utils/middleWares";
import express from "express";
import cors from "cors";
import ChatterRouter from "./routes/chatter.route";
import { connectDb } from "./dbhandler";
import { NODE_ENV } from "./utils/config";
import TestRouter from "./routes/test.route";
import { apolloServer } from "./apolloServer";
import { expressMiddleware } from "@as-integrations/express5";
import { logger } from "./utils/helpers";
import { ChatterType } from "./chatterTypes";
import { gqErrorHandler } from "./utils/graphQlErrorHandler";
const createApp = async () => {
	const app = express();
	await connectDb();
	app.use(express.json());
	app.use(cors());
	app.use(methodLogger);
	// routes
	app.use("/api/chatter", ChatterRouter);
	// test route
	if (NODE_ENV === "test") {
		app.use("/api/test", TestRouter);
	}
	let server = await apolloServer();
	logger.log("Starting Graphql server...");
	app.use("/api/graphql", expressMiddleware(server, {
		context: async ({ req }): Promise<ChatterType> => {
			try {
				let chatter = await extractChatter(req)
				return chatter;
			}
			catch (e) {
				throw gqErrorHandler(e);
			}
		}
	}))
	app.use(unknownEndPoint);
	app.use(errorHandler);
	return { app, apolloServer: server }
}

export default createApp