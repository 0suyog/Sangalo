import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./utils/config";
import { logger } from "./utils/helpers";
export async function connectDb() {
	await mongoose.connect(MONGO_URI)
	if (NODE_ENV === "test") {
		console.log("Test db connected");
		return;
	}
	logger.log("Db connected");
}
