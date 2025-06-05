import "dotenv/config";
import { logger } from "./helpers";
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV;
let uri = process.env.MONGO_TEST_DB;
let secretKey = process.env.SECRETKEY;
if (!uri) {
	logger.log(
		"You might not have set environment variables. Add MONGO_TEST_DB=<your mongo db url> to .env file to run"
	);
	process.exit();
}

if (!secretKey) {
	logger.log(
		"You might not have set environment variables. Add SECRETKEY=<your secret key> to .env file to run"
	);
	process.exit();
}

export const MONGO_URI: string = uri;
export const SECRETKEY: string = secretKey;
