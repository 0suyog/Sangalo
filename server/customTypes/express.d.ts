import { ChatterType } from "../chatterTypes";

declare global {
	namespace Express {
		export interface Request {
			chatter?: ChatterType;
		}
	}
}
