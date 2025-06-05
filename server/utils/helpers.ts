import { NODE_ENV } from "./config";

export const logger = {
	log(messasge: unknown) {
		if (NODE_ENV !== "test") {
			console.log(messasge);
		}
	},
	error(message: unknown) {
		if (NODE_ENV !== "test") {
			console.error(message);
		}
	},
};
