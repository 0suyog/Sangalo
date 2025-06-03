import "dotenv/config";
import server from "..";
export const PORT = process.env.PORT || 3000;
let uri = process.env.MONGO_TEST_DB;
let secretKey = process.env.SECRETKEY;
if (!uri) {
	console.log(
		"You might not have set environment variables. Add MONGO_TEST_DB=<your mongo db url> to .env file to run"
	);
	server.close();
	process.exit();
}

if (!secretKey) {
	console.log(
		"You might not have set environment variables. Add SECRETKEY=<your secret key> to .env file to run"
	);
	server.close();
	process.exit();
}

export const MONGO_URI: string = uri;
export const SECRETKEY: string = secretKey;
