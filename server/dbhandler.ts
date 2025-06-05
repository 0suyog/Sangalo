import mongoose from "mongoose";
import { MONGO_URI, NODE_ENV } from "./utils/config";
import { logger } from "./utils/helpers";
export function connectDb() {
	mongoose.connect(MONGO_URI).then(() => {
		logger.log("Db connected");
		if (NODE_ENV === "test") {
			console.log("Test db connected");
		}
	});
}
