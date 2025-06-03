import mongoose from "mongoose";
import { MONGO_URI } from "./utils/config";
export function connectDb() {
	mongoose.connect(MONGO_URI).then(() => {
		console.log("Db connected");
	});
}
