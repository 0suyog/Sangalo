import {
	bearerTokenToChatter,
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
import { expressMiddleware } from "@as-integrations/express5";
import { logger } from "./utils/helpers";
import { type ChatterType } from "./chatterTypes";
import { gqErrorHandler } from "./utils/graphQlErrorHandler"
import { createServer } from "http";
import { WebSocketServer } from "ws"
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers, typeDefs } from "graphql/messageSchema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { useServer } from "graphql-ws/use/ws"
import { gqError, ServerError } from "utils/errors";
const createApp = async () => {

	const app = express();
	const httpServer = createServer(app)
	const wsServer = new WebSocketServer({ server: httpServer, path: "/api/subscriptions" })
	await connectDb();
	app.use(express.json());
	app.use(cors());
	app.use(methodLogger);
	// routes  
	app.get("/ping", (_req, res) => { res.send('pong') })
	app.use("/api/chatter", ChatterRouter);
	// test route
	if (NODE_ENV === "test") {
		app.use("/api/test", TestRouter);
	}
	let messageSchema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers })
	const serverCleanup = useServer({
		schema: messageSchema,
		context: async (ctx) => {
			console.log(JSON.stringify(ctx.connectionParams, undefined, 2))
			let connectionParams = ctx.connectionParams as { auth?: string } | undefined
			if (!connectionParams) {
				throw new ServerError("Connection params seem to be missing make sure you have put auth in connectionParams", 403, "AUTH_MISSING")
			}
			let auth = connectionParams.auth;
			if (!auth) {
				throw new ServerError("Auth seems to be missing", 403, "AUTH_MISSING")
			}
			try {

				let chatter = await bearerTokenToChatter(auth)
				return { ...chatter }
			} catch (e) {
				throw gqErrorHandler(e)
			}
		}
	}, wsServer)
	let apolloServer = new ApolloServer({
		schema: messageSchema,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose()
						}
					}
				}
			}
		]
	})
	await apolloServer.start()
	logger.log("Starting Graphql server...");
	app.use("/api/graphql", expressMiddleware(apolloServer, {
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
	return httpServer
}

export default createApp