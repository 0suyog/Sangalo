import {
	errorHandler,
	methodLogger,
	unknownEndPoint,
} from "./utils/middleWares";
import express from "express";
import cors from "cors";
import ChatterRouter from "./routes/chatter.route";
import { connectDb } from "./dbhandler";
import { NODE_ENV } from "./utils/config";
import TestRouter from "./routes/test.route";
const app = express();
connectDb();
app.use(express.json());
app.use(cors());
app.use(methodLogger);

// routes
app.use("/api/chatter", ChatterRouter);

// test route
if (NODE_ENV === "test") {
	app.use("/api/test", TestRouter);
}

app.use(unknownEndPoint);
app.use(errorHandler);
export default app;
